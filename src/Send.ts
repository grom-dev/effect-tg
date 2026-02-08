/**
 * Utilities for sending messages.
 */

import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import type * as Content from './Content.ts'
import type * as Dialog from './Dialog.ts'
import type * as Markup from './Markup.ts'
import type * as Reply from './Reply.ts'
import * as Context from 'effect/Context'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Effectable from 'effect/Effectable'
import * as Function from 'effect/Function'
import * as Inspectable from 'effect/Inspectable'
import * as internal from './internal/send.ts'

// =============================================================================
// Send Methods
// =============================================================================

/**
 * Sends a message by calling the appropriate `send*` Bot API method
 * and passing the required parameters.
 */
export const sendMessage: (params: {
  content: Content.Content
  dialog: Dialog.Dialog | Dialog.DialogId
  markup?: Markup.Markup
  reply?: Reply.Reply
  options?: Options
}) => Effect.Effect<
  BotApi.Types.Message,
  BotApiError.BotApiError,
  BotApi.BotApi
> = internal.sendMessage

// =============================================================================
// MessageToSend
// =============================================================================

export const MessageToSendTypeId: unique symbol = Symbol.for('@grom.js/effect-tg/Send/MessageToSend')

export type MessageToSendTypeId = typeof MessageToSendTypeId

/**
 * Message prepared to be sent.
 */
export interface MessageToSend extends
  Inspectable.Inspectable,
  Effect.Effect<
    BotApi.Types.Message,
    BotApiError.BotApiError,
    BotApi.BotApi | TargetDialog
  >
{
  readonly [MessageToSendTypeId]: typeof MessageToSendTypeId
  readonly content: Content.Content
  readonly markup?: Markup.Markup
  readonly reply?: Reply.Reply
  readonly options?: Options

  clone: (override?: {
    content?: Content.Content
    markup?: Markup.Markup
    reply?: Reply.Reply
    options?: Options
  }) => MessageToSend
}

const MessageToSendProto = {
  ...Inspectable.BaseProto,
  ...Effectable.CommitPrototype,

  [MessageToSendTypeId]: MessageToSendTypeId,

  commit(this: MessageToSend) {
    return Effect.flatMap(
      TargetDialog,
      dialog => sendMessage({
        dialog,
        content: this.content,
        markup: this.markup,
        reply: this.reply,
        options: this.options,
      }),
    )
  },

  toJSON(this: MessageToSend) {
    return {
      _id: this[MessageToSendTypeId].description,
      content: this.content,
      markup: this.markup,
      reply: this.reply,
      options: this.options,
    }
  },

  clone(this: MessageToSend, override?: {
    content?: Content.Content
    markup?: Markup.Markup
    reply?: Reply.Reply
    options?: Options
  }): MessageToSend {
    const self = Object.create(MessageToSendProto)
    self.content = override?.content ?? this.content
    self.markup = override?.markup ?? this.markup
    self.reply = override?.reply ?? this.reply
    self.options = override?.options ?? this.options
    return self
  },
}

/**
 * Creates a message prepared to be sent with the specified content
 * and optional parameters.
 */
export const message = (content: Content.Content, params?: {
  markup?: Markup.Markup
  reply?: Reply.Reply
  options?: Options
}): MessageToSend => {
  const self = Object.create(MessageToSendProto)
  self.content = content
  self.markup = params?.markup
  self.reply = params?.reply
  self.options = params?.options
  return self
}

// =============================================================================
// TargetDialog
// =============================================================================

/**
 * Target dialog for sending messages.
 */
export class TargetDialog extends Context.Tag('@grom.js/effect-tg/Send/TargetDialog')<
  TargetDialog,
  Dialog.Dialog | Dialog.DialogId
>() {}

/**
 * Provides the target dialog for sending messages.
 */
export const to: {
  (dialog: Dialog.Dialog): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, Exclude<R, TargetDialog>>
  <A, E, R>(effect: Effect.Effect<A, E, R>, dialog: Dialog.Dialog): Effect.Effect<A, E, Exclude<R, TargetDialog>>
} = Function.dual(2, <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  dialog: Dialog.Dialog,
): Effect.Effect<A, E, Exclude<R, TargetDialog>> => (
  Effect.provideService(effect, TargetDialog, dialog)
))

// =============================================================================
// Reply Markup
// =============================================================================

/**
 * Sets the reply markup for the message.
 */
export const withMarkup: {
  (markup: Markup.Markup): (self: MessageToSend) => MessageToSend
  (self: MessageToSend, markup: Markup.Markup): MessageToSend
} = Function.dual(2, (
  self: MessageToSend,
  markup: Markup.Markup,
): MessageToSend => self.clone({ markup }))

/**
 * Removes the reply markup from the message.
 */
export const withoutMarkup: (
  self: MessageToSend,
) => MessageToSend = self => self.clone({ markup: undefined })

// =============================================================================
// Reply Options
// =============================================================================

/**
 * Sets the information about the message to reply to.
 */
export const withReply: {
  (reply: Reply.Reply): (self: MessageToSend) => MessageToSend
  (self: MessageToSend, reply: Reply.Reply): MessageToSend
} = Function.dual(2, (
  self: MessageToSend,
  reply: Reply.Reply,
): MessageToSend => self.clone({ reply }))

/**
 * Removes the reply options from the message.
 */
export const withoutReply: (
  self: MessageToSend,
) => MessageToSend = self => self.clone({ reply: undefined })

// =============================================================================
// Send Options
// =============================================================================

/**
 * Options for sending a message.
 */
export class Options extends Data.Class<{
  disableNotification?: boolean
  protectContent?: boolean
  allowPaidBroadcast?: boolean
}> {}

export const options = (args: {
  disableNotification?: boolean
  protectContent?: boolean
  allowPaidBroadcast?: boolean
}): Options => new Options(args)

/**
 * Modifies the options for sending a message by merging with existing options.
 *
 * Available shortcuts:
 * - {@linkcode withNotification} / {@linkcode withoutNotification}
 * - {@linkcode withContentProtection} / {@linkcode withoutContentProtection}
 * - {@linkcode withPaidBroadcast} / {@linkcode withoutPaidBroadcast}
 */
export const withOptions: {
  (options: Options): (self: MessageToSend) => MessageToSend
  (self: MessageToSend, options: Options): MessageToSend
} = Function.dual(2, (
  self: MessageToSend,
  options: Options,
): MessageToSend => self.clone({
  options: new Options({
    ...self.options,
    ...options,
  }),
}))

/**
 * Disables notification for the message.
 */
export const withoutNotification: (
  self: MessageToSend,
) => MessageToSend = withOptions({ disableNotification: true })

/**
 * Enables notification for the message.
 */
export const withNotification: (
  self: MessageToSend,
) => MessageToSend = withOptions({ disableNotification: false })

/**
 * Allows message content to be saved and forwarded.
 */
export const withoutContentProtection: (
  self: MessageToSend,
) => MessageToSend = withOptions({ protectContent: false })

/**
 * Protects message content from saving and forwarding.
 */
export const withContentProtection: (
  self: MessageToSend,
) => MessageToSend = withOptions({ protectContent: true })

/**
 * Disallows paid broadcast for the message.
 */
export const withoutPaidBroadcast: (
  self: MessageToSend,
) => MessageToSend = withOptions({ allowPaidBroadcast: false })

/**
 * Allows paid broadcast for the message.
 */
export const withPaidBroadcast: (
  self: MessageToSend,
) => MessageToSend = withOptions({ allowPaidBroadcast: true })
