import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'context-band',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

async function bandAt($: any, on: any, tokens: number, percent: number) {
  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens, window: 200_000, percent }, rateLimits: [] },
  }))
  on('session.start', (_: unknown, e: { cwd: string }) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  return $.ui.mount({ ...BAND, surface: 'terminal' })
}

test('verde sotto il 50%', async ($, on) => {
  const ui = await bandAt($, on, 40_000, 20)
  const pct = await ui.find({ type: 'Text', text: /20%/ })
  expect(pct?.props.color).toBe('success')
  expect((await ui.find({ type: 'Text', text: /40k \/ 200k/ }))).toBeTruthy()
  await ui.unmount()
})

test('gialla sopra il 50%', async ($, on) => {
  const ui = await bandAt($, on, 120_000, 60)
  expect((await ui.find({ type: 'Text', text: /60%/ }))?.props.color).toBe('warning')
  await ui.unmount()
})

test('rossa sopra l\'80%', async ($, on) => {
  const ui = await bandAt($, on, 170_000, 85)
  expect((await ui.find({ type: 'Text', text: /85%/ }))?.props.color).toBe('error')
  await ui.unmount()
})
