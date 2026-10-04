/* 一半小程序 · 连接模式逐页截图（miniprogram-automator connect，mp.screenshot） */
const automator = require('miniprogram-automator')
const path = require('path')
const fs = require('fs')

const OUT = path.join(__dirname, '..', 'preview')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const PAGES = [
  ['start',   '/pages/start/start',   1600],
  ['form',    '/pages/form/form',     1400],
  ['loading', '/pages/loading/loading', 120],
  ['result',  '/pages/result/result', 1800],
  ['quiz',    '/pages/quiz/quiz',     1400]
]

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  for (const [name, route, wait] of PAGES) {
    try {
      const page = await mp.reLaunch(route)
      await page.waitFor(wait)
      const p = path.join(OUT, name + '.png')
      await mp.screenshot({ path: p })
      console.log('SHOT_OK', name, p)
    } catch (e) {
      console.log('SHOT_FAIL', name, e.message)
    }
  }
  await mp.close()
  process.exit(0)
})().catch(e => { console.error('FATAL', e); process.exit(1) })
