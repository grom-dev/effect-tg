import type * as Duration from 'effect/Duration'
import type * as Option from 'effect/Option'
import type * as File from './File.ts'
import type * as LinkPreview from './LinkPreview.ts'
import type * as Text_ from './Text.ts'
import * as Data from 'effect/Data'

/**
 * Content of a message to be sent.
 *
 * @todo Paid media
 * @todo Invoices (fiat & stars)
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1_input_message_content.html TDLib • td_api.InputMessageContent}
 */
export type Content
  = | Text
    | Photo
    | Audio
    | Document
    | Video
    | Animation
    | Voice
    | VideoNote
    | Location
    | Venue
    | Contact
    | Dice
    | Sticker

/**
 * Content of a text message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_text.html TDLib • td_api.inputMessageText}
 * @see {@link https://core.telegram.org/bots/api#sendmessage Bot API • sendMessage}
 */
export class Text extends Data.TaggedClass('Text')<{
  text: Text_.Text
  linkPreview: Option.Option<LinkPreview.LinkPreview>
}> {}

/**
 * Content of a photo message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_photo.html TDLib • td_api.inputMessagePhoto}
 * @see {@link https://core.telegram.org/bots/api#sendphoto Bot API • sendPhoto}
 */
export class Photo extends Data.TaggedClass('Photo')<{
  file: File.Sendable
  caption: Option.Option<Text_.Text>
  layout: 'caption-above' | 'caption-below'
  spoiler: boolean
}> {}

/**
 * Content of an audio message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_audio.html TDLib • td_api.inputMessageAudio}
 * @see {@link https://core.telegram.org/bots/api#sendaudio Bot API • sendAudio}
 */
export class Audio extends Data.TaggedClass('Audio')<{
  file: File.Sendable
  caption: Option.Option<Text_.Text>
  duration: Option.Option<Duration.Duration>
  performer: Option.Option<string>
  title: Option.Option<string>
  thumbnail: Option.Option<File.InputFile>
}> {}

/**
 * Content of a document message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_document.html TDLib • td_api.inputMessageDocument}
 * @see {@link https://core.telegram.org/bots/api#senddocument Bot API • sendDocument}
 */
export class Document extends Data.TaggedClass('Document')<{
  file: File.Sendable
  caption: Option.Option<Text_.Text>
  thumbnail: Option.Option<File.InputFile>
  contentTypeDetection: boolean
}> {}

/**
 * Content of a video message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_video.html TDLib • td_api.inputMessageVideo}
 * @see {@link https://core.telegram.org/bots/api#sendvideo Bot API • sendVideo}
 */
export class Video extends Data.TaggedClass('Video')<{
  file: File.Sendable
  caption: Option.Option<Text_.Text>
  layout: 'caption-above' | 'caption-below'
  spoiler: boolean
  duration: Option.Option<Duration.Duration>
  width: Option.Option<number>
  height: Option.Option<number>
  thumbnail: Option.Option<File.InputFile>
  cover: Option.Option<File.Sendable>
  startAt: Option.Option<Duration.Duration>
  supportsStreaming: boolean
}> {}

/**
 * Content of an animation message (GIF or video without sound).
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_animation.html TDLib • td_api.inputMessageAnimation}
 * @see {@link https://core.telegram.org/bots/api#sendanimation Bot API • sendAnimation}
 */
export class Animation extends Data.TaggedClass('Animation')<{
  file: File.Sendable
  caption: Option.Option<Text_.Text>
  layout: 'caption-above' | 'caption-below'
  spoiler: boolean
  duration: Option.Option<Duration.Duration>
  width: Option.Option<number>
  height: Option.Option<number>
  thumbnail: Option.Option<File.InputFile>
}> {}

/**
 * Content of a voice note message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_voice_note.html TDLib • td_api.inputMessageVoiceNote}
 * @see {@link https://core.telegram.org/bots/api#sendvoice Bot API • sendVoice}
 */
export class Voice extends Data.TaggedClass('Voice')<{
  file: File.Sendable
  caption: Option.Option<Text_.Text>
  duration: Option.Option<Duration.Duration>
}> {}

/**
 * Content of a video note message (round video).
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_video_note.html TDLib • td_api.inputMessageVideoNote}
 * @see {@link https://core.telegram.org/bots/api#sendvideonote Bot API • sendVideoNote}
 */
export class VideoNote extends Data.TaggedClass('VideoNote')<{
  file: Exclude<File.Sendable, File.External>
  duration: Option.Option<Duration.Duration>
  diameter: Option.Option<number>
  thumbnail: Option.Option<File.InputFile>
}> {}

/**
 * Content of a location message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_location.html TDLib • td_api.inputMessageLocation}
 * @see {@link https://core.telegram.org/bots/api#sendlocation Bot API • sendLocation}
 */
export class Location extends Data.TaggedClass('Location')<{
  latitude: number
  longitude: number
  uncertaintyRadius: Option.Option<number>
  livePeriod: Option.Option<Duration.Duration>
  heading: Option.Option<number>
  proximityAlertRadius: Option.Option<number>
}> {}

/**
 * Content of a venue message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_venue.html TDLib • td_api.inputMessageVenue}
 * @see {@link https://core.telegram.org/bots/api#sendvenue Bot API • sendVenue}
 */
export class Venue extends Data.TaggedClass('Venue')<{
  latitude: number
  longitude: number
  title: string
  address: string
  foursquareId: Option.Option<string>
  foursquareType: Option.Option<string>
  googlePlaceId: Option.Option<string>
  googlePlaceType: Option.Option<string>
}> {}

/**
 * Content of a contact message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_contact.html TDLib • td_api.inputMessageContact}
 * @see {@link https://core.telegram.org/bots/api#sendcontact Bot API • sendContact}
 */
export class Contact extends Data.TaggedClass('Contact')<{
  phoneNumber: string
  firstName: string
  lastName: Option.Option<string>
  vcard: Option.Option<string>
}> {}

/**
 * Content of a dice message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_dice.html TDLib • td_api.inputMessageDice}
 * @see {@link https://core.telegram.org/bots/api#senddice Bot API • sendDice}
 */
export class Dice extends Data.TaggedClass('Dice')<{
  emoji: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
}> {}

/**
 * Content of a sticker message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_sticker.html TDLib • td_api.inputMessageSticker}
 * @see {@link https://core.telegram.org/bots/api#sendsticker Bot API • sendSticker}
 */
export class Sticker extends Data.TaggedClass('Sticker')<{
  file: File.Sendable
  emoji: Option.Option<string>
}> {}
