/* 重截 result + loading（修复后验证），一次连接完成两页 */
const automator = require('miniprogram-automator')
const path = require('path')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  mp.on('console', msg => console.log('CONSOLE:', msg.type, msg.message))
  mp.on('exception', err => console.log('EXCEPTION:', err.message))
  const out = path.join(__dirname, '..', 'preview')
  for (const [name, route, wait] of [['result', '/pages/result/result', 3000], ['loading', '/pages/loading/loading', 2500]]) {
    try {
      const page = await mp.reLaunch(route)
      await page.waitFor(wait)
      await mp.screenshot({ path: path.join(out, name + '.png') })
      console.log('SHOT_OK', name)
    } catch (e) {
      console.log('SHOT_FAIL', name, e.message)
    }
  }
  await mp.close()
  process.exit(0)
})().catch(e => { console.error('FATAL', e); process.exit(1) })
