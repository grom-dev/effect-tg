/**
 * Utilities for sending messages.
 */

import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import type * as BotApiTransport from './BotApiTransport.ts'
import type * as Content from './Content.ts'
import type * as Dialog_ from './Dialog.ts'
import type * as Markup from './Markup.ts'
import * as Context from 'effect/Context'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Effectable from 'effect/Effectable'
import * as Function from 'effect/Function'
import * as Inspectable from 'effect/Inspectable'
import * as Pipeable from 'effect/Pipeable'
import * as internal from './internal/send.ts'

// ─── Type ID ──────────────────────────────────────────────────────

const MessageToSendTypeId: unique symbol = Symbol.for('@grom.js/effect-tg/Send/MessageToSend')

// ─── Services ─────────────────────────────────────────────────────

/**
 * Service providing the target dialog for sending messages.
 */
export class Dialog extends Context.Tag('@grom.js/effect-tg/Send/Dialog')<
  Dialog,
  Dialog_.Dialog
>() {}

// ─── Options ──────────────────────────────────────────────────────

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

// ─── Direct Send ──────────────────────────────────────────────────

/**
 * Sends a message directly with explicit parameters.
 *
 * Prefer {@linkcode message} for more composability.
 *
 * Example:
 * ```ts
 * yield* Send.sendMessage({
 *   content: new Content.Text({
 *     text,
 *     linkPreview: Option.none(),
 *   }),
 *   dialog: new Dialog.UserId(userId),
 *   options: new Send.Options({
 *     protectContent: true,
 *   }),
 * })
 * ```
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1send_message.html td.td_api.sendMessage}
 */
export const sendMessage: (params: {
  content: Content.Content
  dialog: Dialog_.Dialog
  options?: Options
  markup?: Markup.Markup
}) => Effect.Effect<
  BotApi.Types.Message,
  BotApiError.BotApiError | BotApiTransport.BotApiTransportError,
  BotApi.BotApi
> = internal.sendMessage

// ─── MessageToSend ────────────────────────────────────────────────

type MessageToSendEffect = Effect.Effect<
  BotApi.Types.Message,
  BotApiError.BotApiError | BotApiTransport.BotApiTransportError,
  BotApi.BotApi | Dialog
>

/**
 * A message prepared to be sent.
 */
export interface MessageToSend extends
  Inspectable.Inspectable,
  MessageToSendEffect
{
  readonly [MessageToSendTypeId]: typeof MessageToSendTypeId
  readonly content: Content.Content
  readonly options: Options
  readonly markup: Markup.Markup | undefined
}

const Proto = {
  [MessageToSendTypeId]: MessageToSendTypeId,
  ...Effectable.CommitPrototype,
  ...Inspectable.BaseProto,

  commit(this: MessageToSend): MessageToSendEffect {
    return Effect.flatMap(
      Dialog,
      dialog => sendMessage({
        dialog,
        content: this.content,
        options: this.options,
        markup: this.markup,
      }),
    )
  },

  toJSON(this: MessageToSend) {
    return {
      _id: this[MessageToSendTypeId].description,
      content: this.content,
      options: this.options,
      markup: this.markup,
    }
  },

  pipe() {
    // eslint-disable-next-line prefer-rest-params
    return Pipeable.pipeArguments(this, arguments)
  },
}

const make = (args: {
  content: Content.Content
  options?: Options
  markup?: Markup.Markup
}): MessageToSend => {
  const self = Object.create(Proto)
  self.content = args.content
  self.options = args.options
  self.markup = args.markup
  return self
}

// ─── Constructors ─────────────────────────────────────────────────

/**
 * Creates a message to send with the given content.
 *
 * Example:
 * ```ts
 * yield* Send.message(content).pipe(
 *   Send.withProtection,
 *   Send.to(dialog),
 * )
 * ```
 */
export const message = (
  content: Content.Content,
): MessageToSend => make({ content })

// ─── Dialog Provider ──────────────────────────────────────────────

export const to: {
  /**
   * Provides the target dialog for sending messages.
   *
   * Example:
   * ```ts
   * // Per-message
   * yield* Send.message(content).pipe(
   *   Send.withProtection,
   *   Send.to(dialog),
   * )
   *
   * // For entire handler (multiple sends)
   * const handler = Effect.gen(function* () {
   *   yield* Send.message(content1)
   *   yield* Send.message(content2)
   * }).pipe(Send.to(dialog))
   * ```
   */
  (dialog: Dialog_.Dialog): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, Exclude<R, Dialog>>
  <A, E, R>(effect: Effect.Effect<A, E, R>, dialog: Dialog_.Dialog): Effect.Effect<A, E, Exclude<R, Dialog>>
} = Function.dual(2, <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  dialog: Dialog_.Dialog,
): Effect.Effect<A, E, Exclude<R, Dialog>> => (
  Effect.provideService(effect, Dialog, dialog)
))

// ─── Options Combinators ──────────────────────────────────────────

/**
 * Modifies the options for sending a message by merging with existing options.
 *
 * Example:
 * ```ts
 * yield* Send.message(content).pipe(
 *   Send.withOptions({
 *     disableNotification: true,
 *     protectContent: true,
 *   }),
 *   Send.to(dialog),
 * )
 * ```
 *
 * Available shortcuts:
 * - {@linkcode withoutNotification}
 * - {@linkcode withNotification}
 * - {@linkcode withoutContentProtection}
 * - {@linkcode withContentProtection}
 * - {@linkcode withoutPaidBroadcast}
 * - {@linkcode withPaidBroadcast}
 */
export const withOptions: {
  (options: Options): (self: MessageToSend) => MessageToSend
  (self: MessageToSend, options: Options): MessageToSend
} = Function.dual(2, (
  self: MessageToSend,
  options: Options,
): MessageToSend => (
  make(
    {
      content: self.content,
      options: new Options({
        ...self.options,
        ...options,
      }),
      markup: self.markup,
    },
  )
))

/**
 * Disables notification for the message.
 *
 * Shortcut for `withOptions({ disableNotification: true })`.
 */
export const withoutNotification: (
  self: MessageToSend,
) => MessageToSend = withOptions({ disableNotification: true })

/**
 * Enables notification for the message.
 *
 * Shortcut for `withOptions({ disableNotification: false })`.
 */
export const withNotification: (
  self: MessageToSend,
) => MessageToSend = withOptions({ disableNotification: false })

/**
 * Allows message content to be saved and forwarded.
 *
 * Shortcut for `withOptions({ protectContent: false })`.
 */
export const withoutContentProtection: (
  self: MessageToSend,
) => MessageToSend = withOptions({ protectContent: false })

/**
 * Protects message content from saving and forwarding.
 *
 * Shortcut for `withOptions({ protectContent: true })`.
 */
export const withContentProtection: (
  self: MessageToSend,
) => MessageToSend = withOptions({ protectContent: true })

/**
 * Disallows paid broadcast for the message.
 *
 * Shortcut for `withOptions({ allowPaidBroadcast: false })`.
 */
export const withoutPaidBroadcast: (
  self: MessageToSend,
) => MessageToSend = withOptions({ allowPaidBroadcast: false })

/**
 * Allows paid broadcast for the message.
 *
 * Shortcut for `withOptions({ allowPaidBroadcast: true })`.
 */
export const withPaidBroadcast: (
  self: MessageToSend,
) => MessageToSend = withOptions({ allowPaidBroadcast: true })

// ─── Markup Combinators ──────────────────────────────────────────

/**
 * Sets the reply markup for the message.
 *
 * Example:
 * ```ts
 * yield* Send.message(content).pipe(
 *   Send.withMarkup(
 *     new Markup.ForceReply({
 *       selective: false,
 *       inputPlaceholder: Option.some("effect-tg or grammY?"),
 *     }),
 *   ),
 *   Send.to(dialog),
 * )
 * ```
 */
export const withMarkup: {
  (markup: Markup.Markup): (self: MessageToSend) => MessageToSend
  (self: MessageToSend, markup: Markup.Markup): MessageToSend
} = Function.dual(2, (
  self: MessageToSend,
  markup: Markup.Markup,
): MessageToSend => (
  make({
    content: self.content,
    options: self.options,
    markup,
  })
))

/**
 * Removes the reply markup from the message.
 */
export const withoutMarkup: (
  self: MessageToSend,
) => MessageToSend = self => make({
  content: self.content,
  options: self.options,
  markup: undefined,
})
