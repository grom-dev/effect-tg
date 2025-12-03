import type * as Effect from 'effect/Effect'
import type * as Bot from './Bot.ts'
import * as internal from './internal/runner.ts'

/**
 * Runner runs a bot using long polling.
 */
export interface Runner<E = never, R = never> {
  readonly run: {
    <E1, R1>(bot: Bot.Bot<E1, R1>): Effect.Effect<
      never,
      E | E1,
      R | Exclude<R1, Bot.Update>
    >
  }
}

/**
 * Creates a simple runner that fetches updates by calling `BotApi.getUpdates`
 * method and handles them one by one.
 */
export const makeSimple = internal.makeSimple
