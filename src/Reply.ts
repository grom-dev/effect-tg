import type * as BotApi from './BotApi.ts'
import * as Data from 'effect/Data'
import * as Option from 'effect/Option'
import * as Dialog from './Dialog.ts'

export class Reply extends Data.Class<{
  dialog: Dialog.Peer | Dialog.DialogId
  messageId: number
  optional: boolean
  taskId: Option.Option<number>
}> {}

export const make = (args: {
  dialog: Dialog.Peer | Dialog.DialogId
  messageId: number
  optional?: boolean
  taskId?: number
}): Reply => new Reply({
  dialog: args.dialog,
  messageId: args.messageId,
  optional: args.optional ?? false,
  taskId: Option.fromNullable(args.taskId),
})

export const toMessage = (
  message: BotApi.Types.Message,
  options?: {
    optional?: boolean
    taskId?: number
  },
): Reply => new Reply({
  dialog: Dialog.DialogId(message.chat.id),
  messageId: message.message_id,
  optional: options?.optional ?? false,
  taskId: Option.fromNullable(options?.taskId),
})
