// pages/form/form.js
const lunar = require('../../utils/lunar.js');

const GENDERS = [
  { key: 'male', label: '我想遇见 · 她', desc: '帮我抽一位女生' },
  { key: 'female', label: '我想遇见 · 他', desc: '帮我抽一位男生' }
];
const STYLES = [
  { key: 'cool', label: '清冷', desc: '疏朗干净，自带气场' },
  { key: 'sunny', label: '阳光', desc: '明亮温暖，笑眼弯弯' },
  { key: 'warm', label: '温润', desc: '柔和知性，如沐春风' },
  { key: 'distant', label: '疏离', desc: '安静淡然，需要走近' }
];
const REGIONS = [
  { key: 'north', label: '北方' },
  { key: 'south', label: '南方' },
  { key: 'none', label: '不透露' }
];

Page({
  data: {
    genders: GENDERS,
    gender: '',
    years: [], months: [], days: [],
    yIdx: 0, mIdx: 0, dIdx: 0,
    birthLabel: '1998 年 1 月 1 日',
    lunarText: '丁丑年 腊月 初三',
    zodiac: '牛',
    constellation: '摩羯座',
    showLunar: false,
    styles: STYLES,
    style: '',
    regions: REGIONS,
    region: 'none',
    canGo: false
  },

  onLoad() {
    const years = [];
    for (let y = 2008; y >= 1970; y--) years.push(y);
    const months = [];
    for (let m = 1; m <= 12; m++) months.push(m);
    const days = [];
    for (let d = 1; d <= 31; d++) days.push(d);
    this.setData({ years, months, days });
    this.refreshBirth();
  },

  onPickGender(e) {
    this.setData({ gender: e.currentTarget.dataset.key });
    this.checkCanGo();
  },

  onYear(e) {
    this.setData({ yIdx: Number(e.detail.value) });
    this.refreshDays();
  },

  onMonth(e) {
    this.setData({ mIdx: Number(e.detail.value) });
    this.refreshDays();
  },

  onDay(e) {
    this.setData({ dIdx: Number(e.detail.value) });
    this.refreshBirth();
  },

  refreshDays() {
    const { years, months, yIdx, mIdx } = this.data;
    const year = years[yIdx] || 1998;
    const month = months[mIdx] || 1;
    const total = lunar.daysInMonth(year, month);
    const days = [];
    for (let d = 1; d <= total; d++) days.push(d);
    let dIdx = this.data.dIdx;
    if (dIdx >= total) dIdx = total - 1;
    this.setData({ days, dIdx });
    this.refreshBirth();
  },

  refreshBirth() {
    const { years, months, days, yIdx, mIdx, dIdx } = this.data;
    if (!years.length) return;
    const year = years[yIdx] || 1998;
    const month = months[mIdx] || 1;
    const day = days[dIdx] || 1;
    const l = lunar.solar2lunar(year, month, day);
    this.setData({
      birthLabel: year + ' 年 ' + month + ' 月 ' + day + ' 日',
      lunarText: l.monthName + ' ' + l.dayName,
      zodiac: l.zodiac,
      constellation: lunar.getConstellation(month, day)
    });
    this.checkCanGo();
  },

  onToggleLunar() {
    this.setData({ showLunar: !this.data.showLunar });
  },

  onPickStyle(e) {
    this.setData({ style: e.currentTarget.dataset.key });
    this.checkCanGo();
  },

  onPickRegion(e) {
    this.setData({ region: e.currentTarget.dataset.key });
  },

  checkCanGo() {
    this.setData({ canGo: !!(this.data.gender && this.data.style) });
  },

  goLoading() {
    const app = getApp();
    const birth = this.resolveBirth();
    const { birthLabel, lunarText, zodiac, constellation, gender, style, region } = this.data;
    app.globalData.userGender = gender;
    app.globalData.userBirth = birth;
    app.globalData.userAge = lunar.calcAge(birth.year, birth.month, birth.day);
    app.globalData.stylePref = style;
    app.globalData.regionPref = region;
    app.globalData.lunarInfo = { birthLabel, lunarText, zodiac, constellation };
    wx.navigateTo({ url: '/pages/loading/loading' });
  },

  resolveBirth() {
    const { years, months, days, yIdx, mIdx, dIdx } = this.data;
    return {
      year: years[yIdx] || 1998,
      month: months[mIdx] || 6,
      day: days[dIdx] || 15
    };
  },

  goQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz?from=form' });
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  }
});
