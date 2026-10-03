// utils/pool.js
// 图池索引与缘分抽卡逻辑
// 规则（已拍板）：性别自动配（男配女 / 女配男）；年龄差 ≤5；气质偏好匹配；
// 保留 5%「反差缘分」跳出常规匹配，增加惊喜感；每张图只出现一次的克制度由池大小保证
const POOL = require('../data/pool-index.json');

const STYLE_CN = {
  cool: '清冷',
  sunny: '阳光',
  warm: '温润',
  distant: '疏离'
};

function pick(list) {
  if (!list || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// 核心抽卡
function drawPortrait(userGender, userAge, stylePref) {
  const targetGender = userGender === 'male' ? 'female' : 'male';

  // 先按目标性别过滤
  const byGender = POOL.filter(p => p.gender === targetGender);
  if (byGender.length === 0) return null;

  // 5% 反差缘分：直接全池（目标性别）随机
  if (Math.random() < 0.05) {
    return Object.assign({}, pick(byGender), { fate: '反差缘分' });
  }

  // 年龄差 ≤5 优先
  const byAge = byGender.filter(p => Math.abs(p.age - userAge) <= 5);
  // 气质偏好
  const byStyle = byAge.filter(p => p.style === stylePref);

  let hit;
  if (byStyle.length > 0) {
    hit = pick(byStyle);
  } else if (byAge.length > 0) {
    hit = pick(byAge);
  } else {
    hit = pick(byGender);
  }
  return Object.assign({}, hit, { fate: '常规缘分' });
}

// 同气质再抽一次（避免立刻重复同一位）
function redraw(lastId, userGender, userAge, stylePref) {
  const targetGender = userGender === 'male' ? 'female' : 'male';
  const byAge = POOL.filter(p => p.gender === targetGender && Math.abs(p.age - userAge) <= 5);
  const byStyle = byAge.filter(p => p.style === stylePref);
  const base = byStyle.length > 1 ? byStyle : (byAge.length > 1 ? byAge : POOL.filter(p => p.gender === targetGender));
  const rest = base.filter(p => p.id !== lastId);
  if (rest.length === 0) return drawPortrait(userGender, userAge, stylePref);
  return Object.assign({}, pick(rest), { fate: '再抽缘分' });
}

// 气质中文名
function styleName(style) {
  return STYLE_CN[style] || style;
}

module.exports = {
  drawPortrait,
  redraw,
  styleName,
  poolSize: POOL.length
};
