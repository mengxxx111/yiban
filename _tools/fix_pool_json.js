/* 修复 pool-index.json：数组根 → { items: [...] }，规避开发者工具 JSON 编译问题 */
const fs = require('fs')
const p = 'C:/Users/King/Desktop/豆包工作任务/小家项目/一半/yiban-miniprogram/data/pool-index.json'
const arr = JSON.parse(fs.readFileSync(p, 'utf8'))
fs.writeFileSync(p, JSON.stringify({ items: arr }, null, 2) + '\n', 'utf8')
console.log('converted items:', arr.length)
