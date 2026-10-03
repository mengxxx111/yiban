// pages/result/result.js
// 结果页：缘分人像 + 国学标签 + 相遇指引 + 行动分支
const app = getApp();
const pool = require('../../utils/pool.js');
const lunar = require('../../utils/lunar.js');
const encounter = require('../../utils/encounter.js');

const REGION_CN = { north: '北方', south: '南方', none: '不透露' };
const XIAOJIA_URL = 'https://yijia.netlify.app';

Page({
  data: {
    portrait: null,
    tags: [],
    regionText: '不透露',
    enc: null,
    imgReady: false,
    imgError: false,
    saving: false,
    hasMbti: false,
    mbtiText: '',
    anim: 'anim-tilt',   // 首入 3D 倾斜光影；再抽切 anim-flip
    holdW: 0
  },

  onLoad() {
    const g = app.globalData;
    let last = g.lastDraw;
    if (!last || !last.portrait) {
      last = {
        portrait: pool.drawPortrait(g.userGender, g.userAge, g.stylePref),
        enc: encounter.drawEncounter()
      };
    }
    g.lastDraw = last;
    this.setData({
      portrait: last.portrait,
      enc: last.enc,
      tags: this.buildTags(g),
      regionText: REGION_CN[g.regionPref] || '不透露',
      hasMbti: !!g.mbti,
      mbtiText: g.mbti || ''
    });
  },

  // 从性格测试返回时刷新标签（onShow 每进入都刷新）
  onShow() {
    const g = app.globalData;
    this.setData({
      tags: this.buildTags(g),
      hasMbti: !!g.mbti,
      mbtiText: g.mbti || ''
    });
  },

  buildTags(g) {
    const b = g.userBirth || { year: 1998, month: 1, day: 1 };
    const l = g.lunarInfo;
    const zodiac = (l && l.zodiac) || lunar.solar2lunar(b.year, b.month, b.day).zodiac;
    const constel = (l && l.constellation) || lunar.getConstellation(b.month, b.day);
    const tags = [
      '生肖 · ' + zodiac,
      '节气 · ' + lunar.getNearestTerm(b.month, b.day),
      constel
    ];
    if (g.mbti) tags.push('性格 · ' + g.mbti);
    return tags;
  },

  onImgLoad() { this.setData({ imgReady: true }); },
  onImgError() { this.setData({ imgError: true }); },

  // 再抽一次（翻牌动画）
  onRedraw() {
    const g = app.globalData;
    const cur = this.data.portrait;
    this.setData({ anim: '' });
    setTimeout(() => {
      const next = pool.redraw(cur ? cur.id : '', g.userGender, g.userAge, g.stylePref);
      const enc = encounter.drawEncounter();
      g.lastDraw = { portrait: next, enc };
      this.setData({
        portrait: next,
        enc,
        imgReady: false,
        imgError: false,
        saving: false,
        anim: 'anim-flip'
      });
    }, 60);
  },

  // ===== 蓄力保存：按住 0.8s 触发（仪式感 + 防误触）=====
  onHoldStart() {
    if (this.data.saving) return;
    if (this._holdTimer) clearInterval(this._holdTimer);
    this._holdTimer = setInterval(() => {
      let w = this.data.holdW + 1.0;
      if (w >= 100) {
        w = 100;
        clearInterval(this._holdTimer);
        this._holdTimer = null;
        this.setData({ holdW: w });
        this.saveCard();
      } else {
        this.setData({ holdW: w });
      }
    }, 8);
  },

  onHoldEnd() { this.resetHold(); },
  onHoldCancel() { this.resetHold(); },

  resetHold() {
    if (this._holdTimer) {
      clearInterval(this._holdTimer);
      this._holdTimer = null;
    }
    if (this.data.holdW > 0) this.setData({ holdW: 0 });
  },

  // 重新选择偏好
  onBackForm() {
    wx.navigateBack({ delta: 1 });
  },

  // 去小家：复制链接
  goXiaojia() {
    wx.setClipboardData({
      data: XIAOJIA_URL,
      success: () => {
        wx.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' });
      }
    });
  },

  // 测性格
  goQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz?from=result' });
  },

  // ===== 保存相遇卡片（canvas 海报）=====
  saveCard() {
    if (this.data.saving) return;
    const { portrait, enc } = this.data;
    if (!portrait) {
      wx.showToast({ title: '还没有缘分，先抽一次', icon: 'none' });
      return;
    }
    this.setData({ saving: true });
    wx.getImageInfo({
      src: portrait.src,
      success: (r) => {
        this.drawPoster(r.path, portrait, enc);
      },
      fail: () => {
        this.setData({ saving: false });
        wx.showToast({ title: '图片加载中，稍后再试', icon: 'none' });
      }
    });
  },

  drawPoster(imgPath, portrait, enc) {
    const g = app.globalData;
    const ctx = wx.createCanvasContext('poster');
    const W = 750;
    const H = 1210;

    // 背景
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0e0c10');
    grad.addColorStop(0.55, '#16131a');
    grad.addColorStop(1, '#1d1822');
    ctx.setFillStyle(grad);
    ctx.fillRect(0, 0, W, H);

    // 顶部品牌
    ctx.setTextAlign('center');
    ctx.setFillStyle('#e8c45c');
    ctx.setFontSize(38);
    ctx.fillText('一 半', W / 2, 106);
    ctx.setFillStyle('#a89f8f');
    ctx.setFontSize(24);
    ctx.fillText('好的关系，各撑一半', W / 2, 152);

    // 金线
    ctx.setStrokeStyle('rgba(212,175,55,0.55)');
    ctx.setLineWidth(2);
    ctx.beginPath();
    ctx.moveTo(60, 182);
    ctx.lineTo(W - 60, 182);
    ctx.stroke();

    // 人像
    ctx.drawImage(imgPath, 0, 200, W, 760);

    // 人像下金线
    ctx.setStrokeStyle('rgba(212,175,55,0.4)');
    ctx.beginPath();
    ctx.moveTo(60, 990);
    ctx.lineTo(W - 60, 990);
    ctx.stroke();

    // 标签行
    ctx.setFillStyle('#d4af37');
    ctx.setFontSize(28);
    const tags = this.buildTags(g).slice(0, 4).join('  ·  ');
    ctx.fillText(tags, W / 2, 1042);

    // 相遇指引
    ctx.setFillStyle('#e8e2d4');
    ctx.setFontSize(30);
    ctx.fillText('在「' + enc.scene + '」', W / 2, 1098);
    ctx.setFillStyle('#cfc6b2');
    ctx.setFontSize(28);
    ctx.fillText(enc.time + '，多留意' + enc.people, W / 2, 1140);

    // 水印
    ctx.setFillStyle('#6e6759');
    ctx.setFontSize(22);
    ctx.fillText('AI 生成 · 内容仅供娱乐参考', W / 2, 1188);

    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'poster',
        success: (res) => {
          this.saveToAlbum(res.tempFilePath);
        },
        fail: () => {
          this.setData({ saving: false });
          wx.showToast({ title: '海报生成失败，请重试', icon: 'none' });
        }
      });
    });
  },

  saveToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        this.setData({ saving: false });
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      },
      fail: (err) => {
        this.setData({ saving: false });
        if (err && err.errMsg && err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '需要相册权限',
            content: '开启相册权限后，才能保存相遇卡片。',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) wx.openSetting();
            }
          });
        } else {
          wx.showToast({ title: '保存失败，请重试', icon: 'none' });
        }
      }
    });
  },

  onShareAppMessage() {
    const { portrait } = this.data;
    return {
      title: '好的关系，各撑一半 —— 我抽到了我的缘分',
      path: '/pages/start/start',
      imageUrl: portrait ? portrait.src : ''
    };
  }
});
