import type * as Content from './Content.ts'
import type * as Dialog from './Dialog.ts'
import { Context, Option } from 'effect'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Match from 'effect/Match'
import * as BotApi from './BotApi.ts'
import * as internal from './internal/send.ts'

/**
 * Sends a message using the given parameters.
 *
 * @todo Specifying reply options is not supported.
 * @todo Specifying reply markup is not supported.
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1send_message.html td.td_api.sendMessage}
 */
export const message = Effect.fnUntraced(
  function* (params: {
    content: Content.Content
    dialog: Dialog.Dialog
    options?: Options
  }) {
    const api = yield* BotApi.BotApi
    const common = {
      ...internal.paramsDialog(params.dialog),
      ...(params.options ? internal.paramsOptions(params.options) : {}),
    }
    return yield* Match.value(params.content).pipe(
      Match.tagsExhaustive({
        Text: text => api.sendMessage({ ...common, ...internal.paramsContent(text) }),
        Photo: photo => api.sendPhoto({ ...common, ...internal.paramsContent(photo) }),
      }),
    )
  },
)

/**
 * Options for sending a message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1message_send_options.html td.td_api.messageSendOptions}
 */
export class Options extends Data.Class<{
  disableNotification?: boolean
  protectContent?: boolean
  allowPaidBroadcast?: boolean
}> {}

export class To extends Context.Tag('@grom.js/effect-tg/Send/To')<
  To,
  Dialog.Dialog
>() {}

export class WithOptions extends Context.Tag('@grom.js/effect-tg/Send/WithOptions')<
  WithOptions,
  Options
>() {}

export const messageOf = Effect.fnUntraced(
  function* (content: Content.Content) {
    const dialog = yield* To
    const maybeOptions = yield* Effect.serviceOption(WithOptions)
    return yield* message({
      content,
      dialog,
      options: Option.getOrUndefined(maybeOptions),
    })
  },
)

export const to = (
  dialog: Dialog.Dialog,
) => <A, E, R>(
  other: Effect.Effect<A, E, R>,
): Effect.Effect<A, E, Exclude<R, To>> =>
  Effect.provideService(other, To, dialog)

export const withOptions = (
  options: Options,
) => <A, E, R>(
  other: Effect.Effect<A, E, R>,
): Effect.Effect<A, E, Exclude<R, WithOptions>> =>
  Effect.provideService(other, WithOptions, options)

export const withNotification = withOptions(new Options({ disableNotification: true }))
export const withoutNotification = withOptions(new Options({ disableNotification: false }))

export const withProtection = withOptions(new Options({ protectContent: true }))
export const withoutProtection = withOptions(new Options({ protectContent: false }))

export const withPaidBroadcast = withOptions(new Options({ allowPaidBroadcast: true }))
export const withoutPaidBroadcast = withOptions(new Options({ allowPaidBroadcast: false }))
