// pages/quiz/quiz.js
// 性格快测：8 题 → MBTI，结果回填到缘分页标签
const quiz = require('../../utils/quiz.js');

Page({
  data: {
    questions: quiz.QUESTIONS,
    cur: 0,
    answers: [],
    done: false,
    mbti: '',
    desc: '',
    from: 'result'
  },

  onLoad(options) {
    this.setData({ from: (options && options.from) || 'result' });
  },

  onAnswer(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const answers = this.data.answers.concat([idx]);
    if (answers.length >= this.data.questions.length) {
      const r = quiz.computeMbti(answers);
      const app = getApp();
      app.globalData.mbti = r.mbti;
      app.globalData.mbtiDesc = r.desc;
      this.setData({ answers, done: true, mbti: r.mbti, desc: r.desc });
    } else {
      this.setData({ answers, cur: answers.length });
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onShareAppMessage() {
    return {
      title: '我的性格是 ' + (this.data.mbti || '？') + '，你的呢',
      path: '/pages/start/start'
    };
  }
});
