/* 将图池数据内联进 pool.js，绕过开发者工具 JSON require 编译问题 */
const fs = require('fs')
const base = 'C:/Users/King/Desktop/豆包工作任务/小家项目/一半/yiban-miniprogram'

const data = JSON.parse(fs.readFileSync(base + '/data/pool-index.json', 'utf8')).items
const itemsJs = JSON.stringify(data, null, 2)
  .split('\n').join('\n')

let poolJs = fs.readFileSync(base + '/utils/pool.js', 'utf8')
const oldLine = "const POOL = require('../data/pool-index.json').items;"
if (!poolJs.includes(oldLine)) { console.error('OLD LINE NOT FOUND'); process.exit(1) }
const newLine = "const POOL = " + itemsJs + ";\n// 注：图池数据已内联（开发者工具对 require JSON 编译异常），数据源备份见 data/pool-index.json"
poolJs = poolJs.replace(oldLine, newLine)
fs.writeFileSync(base + '/utils/pool.js', poolJs, 'utf8')

// JSON 还原为数组（纯数据文档，不再被代码 require）
fs.writeFileSync(base + '/data/pool-index.json', JSON.stringify(data, null, 2) + '\n', 'utf8')
console.log('inlined items:', data.length)
