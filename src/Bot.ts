import type * as Effect from 'effect/Effect'
import type * as BotApi from './BotApi.ts'
import * as Context from 'effect/Context'

export type Bot<E = never, R = never> = Effect.Effect<void, E, R | Update>

export class Update extends Context.Tag('@grom.js/effect-tg/Bot/Update')<
  Update,
  BotApi.Types.Update
>() {}
