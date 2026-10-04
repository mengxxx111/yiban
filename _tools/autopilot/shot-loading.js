/* 截 loading 页真正的过渡加载态（短等待） */
const automator = require('miniprogram-automator')
const path = require('path')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  try {
    const page = await mp.reLaunch('/pages/loading/loading')
    await page.waitFor(200)
    await mp.screenshot({ path: path.join(__dirname, '..', 'preview', 'loading.png') })
    console.log('LOADING_SHOT_OK')
  } catch (e) {
    console.log('SHOT_FAIL', e.message)
  }
  await mp.close()
  process.exit(0)
})().catch(e => { console.error('FATAL', e); process.exit(1) })
