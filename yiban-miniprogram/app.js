// 一半 · 缘分抽卡小程序
// 好的关系，各撑一半 —— 你做好你的一半，剩下的，看遇见谁
App({
  globalData: {
    userGender: '',      // male / female
    userBirth: null,     // { year, month, day }
    userAge: 0,          // 周岁
    lunarInfo: null,     // { lunarText, zodiac, constellation, term }
    stylePref: '',       // cool / sunny / warm / distant
    regionPref: '',      // north / south / none
    mbti: '',            // 性格测试结果，如 'INFJ'
    mbtiDesc: '',        // 性格描述
    lastDraw: null       // 最近一次抽卡记录
  },

  onLaunch() {
    // 首版无需登录；云开发阶段可在此初始化云环境
  }
});
