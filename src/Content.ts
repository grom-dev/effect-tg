import type * as Option from 'effect/Option'
import type * as File from './File.ts'
import type * as LinkPreview from './LinkPreview.ts'
import type * as Text$ from './Text.ts'
import * as Data from 'effect/Data'

/**
 * Content of a message to be sent.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1_input_message_content.html td.td_api.InputMessageContent}
 */
export type Content
  = | Text
    | Photo

/**
 * Content of a text message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_text.html td.td_api.inputMessageText}
 */
export class Text extends Data.TaggedClass('Text')<{
  text: Text$.Text
  linkPreview: Option.Option<LinkPreview.LinkPreview>
}> {}

/**
 * Content of a photo message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_photo.html td.td_api.inputMessagePhoto}
 */
export class Photo extends Data.TaggedClass('Photo')<{
  file: File.Sendable
  caption: Option.Option<Text$.Text>
  layout: 'caption-above' | 'caption-below'
  spoiler: boolean
}> {}
