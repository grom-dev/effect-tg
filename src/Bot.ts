import type * as Effect from 'effect/Effect'
import type * as BotApi from './BotApi.ts'
import * as Context from 'effect/Context'

export type Bot<E = never, R = never> = Effect.Effect<void, E, R | Update>

export interface Update { readonly _: unique symbol }
export const Update: Context.Tag<Update, BotApi.Types.Update> = Context.GenericTag<Update, BotApi.Types.Update>('@grom.js/effect-tg/Bot/Update')

export interface Middleware {
  <E, R>(self: Bot<E, R>): Bot<any, any>
}

export const middleware: <M extends Middleware>(middleware: M) => M = mw => mw
