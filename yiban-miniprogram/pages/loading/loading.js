// pages/loading/loading.js
// 加载页：模拟「正在遇见」，完成后抽卡并进入结果页
const app = getApp();
const pool = require('../../utils/pool.js');
const encounter = require('../../utils/encounter.js');

Page({
  data: {
    progress: 0
  },

  onLoad() {
    // 进度条推进（视觉反馈）
    let p = 0;
    const timer = setInterval(() => {
      p += 12;
      if (p > 100) p = 100;
      this.setData({ progress: p });
      if (p >= 100) {
        clearInterval(timer);
        this.finish();
      }
    }, 180);

    // 兜底：2.6s 强制完成
    setTimeout(() => {
      clearInterval(timer);
      if (this.data.progress < 100) {
        this.setData({ progress: 100 });
        this.finish();
      }
    }, 2600);
  },

  finish() {
    const g = app.globalData;
    const portrait = pool.drawPortrait(g.userGender, g.userAge, g.stylePref);
    const enc = encounter.drawEncounter();
    g.lastDraw = { portrait, enc };
    wx.redirectTo({ url: '/pages/result/result' });
  }
});
