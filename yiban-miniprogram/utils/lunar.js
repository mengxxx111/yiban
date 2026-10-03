// utils/lunar.js
// 国学文化趣味匹配工具：农历换算 · 生肖 · 星座 · 节气（娱乐参考，非命理）
// 农历数据表为公开经典万年历数据（1900-2100），用于文化趣味展示

// ---------- 农历数据表（1900-2100，共 201 项） ----------
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x0a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
];

const MONTH_CN = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const DAY_CN = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
const ZODIAC = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const CONSTELLATIONS = ['水瓶座','双鱼座','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座'];
const CONST_BOUNDARY = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];

// 24 节气典型公历日（每月两个，日期近似，标注娱乐参考）
const TERMS = [
  { m: 1,  d: 5,  name: '小寒' }, { m: 1,  d: 20, name: '大寒' },
  { m: 2,  d: 4,  name: '立春' }, { m: 2,  d: 19, name: '雨水' },
  { m: 3,  d: 5,  name: '惊蛰' }, { m: 3,  d: 20, name: '春分' },
  { m: 4,  d: 5,  name: '清明' }, { m: 4,  d: 20, name: '谷雨' },
  { m: 5,  d: 5,  name: '立夏' }, { m: 5,  d: 21, name: '小满' },
  { m: 6,  d: 6,  name: '芒种' }, { m: 6,  d: 21, name: '夏至' },
  { m: 7,  d: 7,  name: '小暑' }, { m: 7,  d: 23, name: '大暑' },
  { m: 8,  d: 7,  name: '立秋' }, { m: 8,  d: 23, name: '处暑' },
  { m: 9,  d: 7,  name: '白露' }, { m: 9,  d: 23, name: '秋分' },
  { m: 10, d: 8,  name: '寒露' }, { m: 10, d: 23, name: '霜降' },
  { m: 11, d: 7,  name: '立冬' }, { m: 11, d: 22, name: '小雪' },
  { m: 12, d: 7,  name: '大雪' }, { m: 12, d: 22, name: '冬至' }
];

function lYearDays(y) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y) {
  return LUNAR_INFO[y - 1900] & 0xf;
}

function leapDays(y) {
  if (leapMonth(y)) {
    return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y, m) {
  return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

// 阳历 → 农历
function solar2lunar(y, m, d) {
  const base = new Date(1900, 0, 31); // 1900-01-31 = 农历庚子年正月初一
  const obj = new Date(y, m - 1, d);
  let offset = Math.floor((obj.getTime() - base.getTime()) / 86400000);

  let temp = 0;
  let i;
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) { offset += temp; i--; }

  const year = i;
  const leap = leapMonth(i);
  let isLeap = false;
  let month = 1;
  let day = 1;
  let j;

  for (j = 1; j < 13 && offset > 0; j++) {
    if (leap > 0 && j === (leap + 1) && !isLeap) {
      --j;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, j);
    }
    if (isLeap && j === (leap + 1)) isLeap = false;
    offset -= temp;
    if (offset <= 0) break;
  }

  offset += temp;
  month = j;
  day = offset;

  return {
    lunarYear: year,
    lunarMonth: month,
    lunarDay: day,
    isLeap,
    monthName: (isLeap ? '闰' : '') + MONTH_CN[month - 1] + '月',
    dayName: DAY_CN[day - 1],
    zodiac: ZODIAC[(year - 4) % 12],
    animalYear: year
  };
}

// 星座
function getConstellation(m, d) {
  let idx = m - 1;
  if (d < CONST_BOUNDARY[idx]) idx = (idx + 11) % 12;
  return CONSTELLATIONS[idx];
}

// 最近节气（近似，娱乐参考）
function getNearestTerm(m, d) {
  let nearest = TERMS[0];
  let minDiff = 999;
  for (const t of TERMS) {
    const diff = Math.abs((t.m - m) * 30 + (t.d - d));
    if (diff < minDiff) { minDiff = diff; nearest = t; }
  }
  return nearest.name;
}

// 周岁年龄
function calcAge(year, month, day) {
  const now = new Date();
  let age = now.getFullYear() - year;
  const curMonth = now.getMonth() + 1;
  const curDay = now.getDate();
  if (curMonth < month || (curMonth === month && curDay < day)) age--;
  return Math.max(age, 0);
}

// 年龄段档位：20s / 25s / 30s / 35s / 40s（匹配年龄差 ≤5 用）
function ageBucket(age) {
  if (age <= 23) return 20;
  if (age <= 28) return 25;
  if (age <= 33) return 30;
  if (age <= 38) return 35;
  return 40;
}

// 可匹配的年龄段集合（年龄差 ≤5，含相邻档）
function matchBuckets(age) {
  const b = ageBucket(age);
  const buckets = [b];
  if (b - 5 >= 15) buckets.push(b - 5);
  if (b + 5 <= 50) buckets.push(b + 5);
  return buckets;
}

// 月度天数（用于生日联动）
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

module.exports = {
  solar2lunar,
  getConstellation,
  getNearestTerm,
  calcAge,
  ageBucket,
  matchBuckets,
  daysInMonth
};
