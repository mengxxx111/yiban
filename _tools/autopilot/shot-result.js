/* 单独重截 result 页面，带控制台/异常监听 */
const automator = require('miniprogram-automator')
const path = require('path')

const p = path.join(__dirname, '..', 'preview', 'result.png')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  mp.on('console', msg => console.log('CONSOLE:', msg.type, msg.message))
  mp.on('exception', err => console.log('EXCEPTION:', err.message))
  try {
    const page = await mp.reLaunch('/pages/result/result')
    console.log('PAGE_ROUTE_OK', page.path)
    await page.waitFor(5000)
    await mp.screenshot({ path: p })
    console.log('SHOT_OK', p)
  } catch (e) {
    console.log('SHOT_FAIL', e.message)
  }
  await mp.close()
  process.exit(0)
})().catch(e => { console.error('FATAL', e); process.exit(1) })
