import type * as Option from 'effect/Option'
import * as Data from 'effect/Data'

/**
 * Reply markup for the message.
 */
export type Markup
  = | InlineKeyboard
    | ReplyKeyboard
    | ReplyKeyboardRemove
    | ForceReply

export class InlineKeyboard extends Data.TaggedClass('InlineKeyboard')<{
  rows: [] // TODO
}> {}

export class ReplyKeyboard extends Data.TaggedClass('ReplyKeyboard')<{
  rows: [] // TODO
  persistent: boolean
  resizable: boolean
  oneTime: boolean
  selective: boolean
  inputPlaceholder: Option.Option<string>
}> {}

export class ReplyKeyboardRemove extends Data.TaggedClass('ReplyKeyboardRemove')<{
  selective: boolean
}> {}

export class ForceReply extends Data.TaggedClass('ForceReply')<{
  selective: boolean
  inputPlaceholder: Option.Option<string>
}> {}
