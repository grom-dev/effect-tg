import type * as Effect from 'effect/Effect'
import type * as BotApi from './BotApi.ts'
import * as Context from 'effect/Context'

export type Bot<E = never, R = never> = Effect.Effect<void, E, R | Update>

export interface Update extends Readonly<BotApi.Types.Update> {}

export const Update: Context.Service<Update, Update> = Context.Service<Update>('@grom.js/effect-tg/Bot/Update')

export interface Middleware {
  <E, R>(self: Bot<E, R>): Bot<any, any>
}

export const middleware: <M extends Middleware>(middleware: M) => M = mw => mw
