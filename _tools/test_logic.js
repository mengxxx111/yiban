// _tools/test_logic.js —— 一半小程序核心逻辑运行时验证（不进小程序包）
const path = require('path');
const base = path.join(__dirname, '..', 'yiban-miniprogram');
const lunar = require(path.join(base, 'utils', 'lunar.js'));
const pool = require(path.join(base, 'utils', 'pool.js'));
const encounter = require(path.join(base, 'utils', 'encounter.js'));
const quiz = require(path.join(base, 'utils', 'quiz.js'));

let pass = 0, fail = 0;
function assert(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  → ' + extra : '')); }
}

console.log('== 农历换算 ==');
const a = lunar.solar2lunar(2024, 2, 10);
assert('2024-02-10 = 甲辰年正月初一(龙年)', a.lunarMonth === 1 && a.lunarDay === 1 && a.zodiac === '龙', JSON.stringify(a));
const b = lunar.solar2lunar(1998, 1, 1);
assert('1998-01-01 = 腊月(丁丑牛年)', a.zodiac && b.monthName.indexOf('腊') === 0 || b.monthName === '冬月', b.monthName + ' ' + b.dayName);
const c = lunar.solar2lunar(2008, 8, 8);
assert('2008-08-08 = 七月初八(鼠年)', c.lunarMonth === 7 && c.lunarDay === 8 && c.zodiac === '鼠', JSON.stringify(c));
const now = lunar.solar2lunar(2026, 10, 3);
assert('2026-10-03 可换算', !!now.monthName && !!now.dayName && !!now.zodiac, JSON.stringify(now));

console.log('== 星座 / 节气 / 年龄 ==');
assert('8月23日=处女座', lunar.getConstellation(8, 23) === '处女座');
assert('1月19日=摩羯座', lunar.getConstellation(1, 19) === '摩羯座');
assert('1月20日=水瓶座', lunar.getConstellation(1, 20) === '水瓶座');
assert('2月10日近立春', lunar.getNearestTerm(2, 10) === '立春');
assert('年龄计算 1998-01-01 → 28', lunar.calcAge(1998, 1, 1) === 28, String(lunar.calcAge(1998, 1, 1)));
assert('ageBucket(28)=25 / matchBuckets 含 20/25/30', lunar.ageBucket(28) === 25 && lunar.matchBuckets(28).length === 3);

console.log('== 抽卡逻辑（性别反配 / 5%反差 / 再抽不重复）==');
const p1 = pool.drawPortrait('male', 28, 'cool');
assert('男用户抽到女生', p1 && p1.gender === 'female', JSON.stringify(p1));
const p2 = pool.drawPortrait('female', 25, 'sunny');
assert('女用户抽到男生', p2 && p2.gender === 'male', JSON.stringify(p2));
assert('有缘分标签', p1 && (p1.fate === '常规缘分' || p1.fate === '反差缘分'));
const p3 = pool.redraw(p1.id, 'male', 28, 'cool');
assert('再抽不重复同一张', p3.id !== p1.id, p1.id + ' vs ' + p3.id);
const p4 = pool.drawPortrait('male', 22, 'warm');
assert('22岁抽到年龄差≤5', p4 && Math.abs(p4.age - 22) <= 5, JSON.stringify(p4));

console.log('== 相遇指引 ==');
const e1 = encounter.drawEncounter();
assert('指引三要素齐全', e1.time && e1.scene && e1.people && e1.text);

console.log('== 性格测试 ==');
const r = quiz.computeMbti([0, 1, 0, 1, 0, 1, 0, 1]);
assert('8题结果合法4字母', /^[EI][SN][TF][JP]$/.test(r.mbti), r.mbti);
assert('有性格描述', !!r.desc);
assert('题库8题', quiz.QUESTIONS.length === 8);

console.log('== 图池覆盖 ==');
assert('图池16张', pool.poolSize === 16, String(pool.poolSize));

console.log('');
console.log('结果: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail > 0 ? 1 : 0);
