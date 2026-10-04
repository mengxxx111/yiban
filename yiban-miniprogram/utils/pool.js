// utils/pool.js
// 图池索引与缘分抽卡逻辑
// 规则（已拍板）：性别自动配（男配女 / 女配男）；年龄差 ≤5；气质偏好匹配；
// 保留 5%「反差缘分」跳出常规匹配，增加惊喜感；每张图只出现一次的克制度由池大小保证
const POOL = [
  {
    "id": "f20warm01",
    "gender": "female",
    "age": 22,
    "style": "warm",
    "src": "/assets/portrait-f20-warm.jpg"
  },
  {
    "id": "f20sunny01",
    "gender": "female",
    "age": 22,
    "style": "sunny",
    "src": "/assets/portrait-f20-sunny.jpg"
  },
  {
    "id": "f25cool01",
    "gender": "female",
    "age": 25,
    "style": "cool",
    "src": "/assets/portrait-f25-cool.jpg"
  },
  {
    "id": "f25sunny01",
    "gender": "female",
    "age": 25,
    "style": "sunny",
    "src": "/assets/portrait-f25-sunny.jpg"
  },
  {
    "id": "f30distant01",
    "gender": "female",
    "age": 33,
    "style": "distant",
    "src": "/assets/portrait-f30-distant.jpg"
  },
  {
    "id": "f35cool01",
    "gender": "female",
    "age": 35,
    "style": "cool",
    "src": "/assets/portrait-f35-cool.jpg"
  },
  {
    "id": "f35sunny01",
    "gender": "female",
    "age": 35,
    "style": "sunny",
    "src": "/assets/portrait-f35-sunny.jpg"
  },
  {
    "id": "f40cool01",
    "gender": "female",
    "age": 41,
    "style": "cool",
    "src": "/assets/portrait-f40-cool.jpg"
  },
  {
    "id": "m20warm01",
    "gender": "male",
    "age": 23,
    "style": "warm",
    "src": "/assets/portrait-m20-warm.jpg"
  },
  {
    "id": "m25cool01",
    "gender": "male",
    "age": 25,
    "style": "cool",
    "src": "/assets/portrait-m25-cool.jpg"
  },
  {
    "id": "m25sunny01",
    "gender": "male",
    "age": 25,
    "style": "sunny",
    "src": "/assets/portrait-m25-sunny.jpg"
  },
  {
    "id": "m30sunny01",
    "gender": "male",
    "age": 31,
    "style": "sunny",
    "src": "/assets/portrait-m30-sunny.jpg"
  },
  {
    "id": "m30warm01",
    "gender": "male",
    "age": 32,
    "style": "warm",
    "src": "/assets/portrait-m30-warm.jpg"
  },
  {
    "id": "m35cool01",
    "gender": "male",
    "age": 35,
    "style": "cool",
    "src": "/assets/portrait-m35-cool.jpg"
  },
  {
    "id": "m35sunny01",
    "gender": "male",
    "age": 35,
    "style": "sunny",
    "src": "/assets/portrait-m35-sunny.jpg"
  },
  {
    "id": "m40warm01",
    "gender": "male",
    "age": 42,
    "style": "warm",
    "src": "/assets/portrait-m40-warm.jpg"
  }
];
// 注：图池数据已内联（开发者工具对 require JSON 编译异常），数据源备份见 data/pool-index.json

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
