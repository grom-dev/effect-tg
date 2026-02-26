import type * as Effect from 'effect/Effect'
import type * as BotApi from './BotApi.ts'
import * as Context from 'effect/Context'

export type Bot<E = never, R = never> = Effect.Effect<void, E, R | Update>

const _Update: Context.TagClass<Update, '@grom.js/effect-tg/Bot/Update', BotApi.Types.Update> = Context.Tag('@grom.js/effect-tg/Bot/Update')<Update, BotApi.Types.Update>()
export class Update extends _Update {}

export interface Middleware {
  <E, R>(self: Bot<E, R>): Bot<any, any>
}

export const middleware: <M extends Middleware>(middleware: M) => M = mw => mw
