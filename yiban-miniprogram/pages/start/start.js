// pages/start/start.js
Page({
  goForm() {
    wx.navigateTo({ url: '/pages/form/form' });
  },

  onShareAppMessage() {
    return {
      title: '好的关系，各撑一半 —— 抽取你的另一半',
      path: '/pages/start/start'
    };
  }
});
