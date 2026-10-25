import { atom, read, update } from 'claude-code'
import type { Register, SessionContextUsage } from 'claude-code'

import type { ContextFill } from '../types'

const fill = atom({ plugin: 'context-band', key: 'fill' } as const, null)

const BAR_CELLS = 20

function toFill(context: SessionContextUsage): ContextFill | null {
  if (context.tokens === undefined || context.window <= 0) {
    return null
  }

  const percent = context.percent ?? Math.round((context.tokens / context.window) * 100)

  return { tokens: context.tokens, window: context.window, percent }
}

function colorFor(percent: number) {
  if (percent > 80) return 'error'
  if (percent > 50) return 'warning'
  return 'success'
}

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const { context } = await $.session.usage()
    await update($, fill, () => toFill(context))

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('context')) {
      await update($, fill, () => toFill(e.context))
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, fill)

    if (e.props.hasSurvey || current === null) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const percent = Math.min(100, Math.max(0, current.percent))
    const filled = Math.round((percent / 100) * BAR_CELLS)
    const color = colorFor(percent)

    return (
      <Box>
        <Text dimColor>Contesto </Text>
        <Text color={color}>{'█'.repeat(filled)}</Text>
        <Text dimColor>{'░'.repeat(BAR_CELLS - filled)}</Text>
        <Text color={color} tabular>
          {' '}
          {percent}%
        </Text>
        <Text dimColor tabular>
          {' '}
          · {formatTokens(current.tokens)} / {formatTokens(current.window)} token
        </Text>
      </Box>
    )
  })
}
