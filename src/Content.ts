import type * as Duration from 'effect/Duration'
import type * as File from './File.ts'
import type * as LinkPreview from './LinkPreview.ts'
import type * as Text_ from './Text.ts'
import * as Option from 'effect/Option'

/**
 * Content of a message to be sent.
 *
 * @todo Paid media
 * @todo Invoices (fiat & stars)
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1_input_message_content.html TDLib • td_api.InputMessageContent}
 */
export type Content =
  | Text
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
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_text.html TDLib • td_api.inputMessageText}
 * @see {@link https://core.telegram.org/bots/api#sendmessage Bot API • sendMessage}
 */
export interface Text {
  readonly _tag: 'Text'
  readonly text: Text_.Text
  readonly linkPreview: Option.Option<LinkPreview.LinkPreview>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_photo.html TDLib • td_api.inputMessagePhoto}
 * @see {@link https://core.telegram.org/bots/api#sendphoto Bot API • sendPhoto}
 */
export interface Photo {
  readonly _tag: 'Photo'
  readonly file: File.FileId | File.External | File.InputFile
  readonly caption: Option.Option<Text_.Text>
  readonly layout: 'caption-above' | 'caption-below'
  readonly spoiler: boolean
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_audio.html TDLib • td_api.inputMessageAudio}
 * @see {@link https://core.telegram.org/bots/api#sendaudio Bot API • sendAudio}
 */
export interface Audio {
  readonly _tag: 'Audio'
  readonly file: File.FileId | File.External | File.InputFile
  readonly caption: Option.Option<Text_.Text>
  readonly duration: Option.Option<Duration.Duration>
  readonly performer: Option.Option<string>
  readonly title: Option.Option<string>
  readonly thumbnail: Option.Option<File.InputFile>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_document.html TDLib • td_api.inputMessageDocument}
 * @see {@link https://core.telegram.org/bots/api#senddocument Bot API • sendDocument}
 */
export interface Document {
  readonly _tag: 'Document'
  readonly file: File.FileId | File.External | File.InputFile
  readonly caption: Option.Option<Text_.Text>
  readonly thumbnail: Option.Option<File.InputFile>
  readonly contentTypeDetection: boolean
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_video.html TDLib • td_api.inputMessageVideo}
 * @see {@link https://core.telegram.org/bots/api#sendvideo Bot API • sendVideo}
 */
export interface Video {
  readonly _tag: 'Video'
  readonly file: File.FileId | File.External | File.InputFile
  readonly caption: Option.Option<Text_.Text>
  readonly layout: 'caption-above' | 'caption-below'
  readonly spoiler: boolean
  readonly duration: Option.Option<Duration.Duration>
  readonly width: Option.Option<number>
  readonly height: Option.Option<number>
  readonly thumbnail: Option.Option<File.InputFile>
  readonly cover: Option.Option<File.FileId | File.External | File.InputFile>
  readonly startAt: Option.Option<Duration.Duration>
  readonly supportsStreaming: boolean
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_animation.html TDLib • td_api.inputMessageAnimation}
 * @see {@link https://core.telegram.org/bots/api#sendanimation Bot API • sendAnimation}
 */
export interface Animation {
  readonly _tag: 'Animation'
  readonly file: File.FileId | File.External | File.InputFile
  readonly caption: Option.Option<Text_.Text>
  readonly layout: 'caption-above' | 'caption-below'
  readonly spoiler: boolean
  readonly duration: Option.Option<Duration.Duration>
  readonly width: Option.Option<number>
  readonly height: Option.Option<number>
  readonly thumbnail: Option.Option<File.InputFile>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_voice_note.html TDLib • td_api.inputMessageVoiceNote}
 * @see {@link https://core.telegram.org/bots/api#sendvoice Bot API • sendVoice}
 */
export interface Voice {
  readonly _tag: 'Voice'
  readonly file: File.FileId | File.External | File.InputFile
  readonly caption: Option.Option<Text_.Text>
  readonly duration: Option.Option<Duration.Duration>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_video_note.html TDLib • td_api.inputMessageVideoNote}
 * @see {@link https://core.telegram.org/bots/api#sendvideonote Bot API • sendVideoNote}
 */
export interface VideoNote {
  readonly _tag: 'VideoNote'
  readonly file: File.FileId | File.InputFile
  readonly duration: Option.Option<Duration.Duration>
  readonly diameter: Option.Option<number>
  readonly thumbnail: Option.Option<File.InputFile>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_location.html TDLib • td_api.inputMessageLocation}
 * @see {@link https://core.telegram.org/bots/api#sendlocation Bot API • sendLocation}
 */
export interface Location {
  readonly _tag: 'Location'
  readonly latitude: number
  readonly longitude: number
  readonly uncertaintyRadius: Option.Option<number>
  readonly livePeriod: Option.Option<Duration.Duration>
  readonly heading: Option.Option<number>
  readonly proximityAlertRadius: Option.Option<number>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_venue.html TDLib • td_api.inputMessageVenue}
 * @see {@link https://core.telegram.org/bots/api#sendvenue Bot API • sendVenue}
 */
export interface Venue {
  readonly _tag: 'Venue'
  readonly latitude: number
  readonly longitude: number
  readonly title: string
  readonly address: string
  readonly foursquareId: Option.Option<string>
  readonly foursquareType: Option.Option<string>
  readonly googlePlaceId: Option.Option<string>
  readonly googlePlaceType: Option.Option<string>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_contact.html TDLib • td_api.inputMessageContact}
 * @see {@link https://core.telegram.org/bots/api#sendcontact Bot API • sendContact}
 */
export interface Contact {
  readonly _tag: 'Contact'
  readonly phoneNumber: string
  readonly firstName: string
  readonly lastName: Option.Option<string>
  readonly vcard: Option.Option<string>
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_dice.html TDLib • td_api.inputMessageDice}
 * @see {@link https://core.telegram.org/bots/api#senddice Bot API • sendDice}
 */
export interface Dice {
  readonly _tag: 'Dice'
  readonly emoji: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
}

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_sticker.html TDLib • td_api.inputMessageSticker}
 * @see {@link https://core.telegram.org/bots/api#sendsticker Bot API • sendSticker}
 */
export interface Sticker {
  readonly _tag: 'Sticker'
  readonly file: File.FileId | File.External | File.InputFile
  readonly emoji: Option.Option<string>
}

// ——— Constructors ——————————————————————————————————————————————————————————

export const text = (
  text: Text_.Text,
  options?: {
    linkPreview?: LinkPreview.LinkPreview
  },
): Text => ({
  _tag: 'Text',
  text,
  linkPreview: Option.fromNullishOr(options?.linkPreview),
})

export const photo = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    layout?: 'caption-above' | 'caption-below'
    spoiler?: boolean
  },
): Photo => ({
  _tag: 'Photo',
  file,
  caption: Option.fromNullishOr(options.caption),
  layout: options.layout ?? 'caption-below',
  spoiler: options.spoiler ?? false,
})

export const audio = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    duration?: Duration.Duration
    performer?: string
    title?: string
    thumbnail?: File.InputFile
  },
): Audio => ({
  _tag: 'Audio',
  file,
  caption: Option.fromNullishOr(options.caption),
  duration: Option.fromNullishOr(options.duration),
  performer: Option.fromNullishOr(options.performer),
  title: Option.fromNullishOr(options.title),
  thumbnail: Option.fromNullishOr(options.thumbnail),
})

export const document = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    thumbnail?: File.InputFile
    contentTypeDetection?: boolean
  },
): Document => ({
  _tag: 'Document',
  file,
  caption: Option.fromNullishOr(options.caption),
  thumbnail: Option.fromNullishOr(options.thumbnail),
  contentTypeDetection: options.contentTypeDetection ?? false,
})

export const video = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    layout?: 'caption-above' | 'caption-below'
    spoiler?: boolean
    duration?: Duration.Duration
    width?: number
    height?: number
    thumbnail?: File.InputFile
    cover?: File.FileId | File.External | File.InputFile
    startAt?: Duration.Duration
    supportsStreaming?: boolean
  },
): Video => ({
  _tag: 'Video',
  file,
  caption: Option.fromNullishOr(options.caption),
  layout: options.layout ?? 'caption-below',
  spoiler: options.spoiler ?? false,
  duration: Option.fromNullishOr(options.duration),
  width: Option.fromNullishOr(options.width),
  height: Option.fromNullishOr(options.height),
  thumbnail: Option.fromNullishOr(options.thumbnail),
  cover: Option.fromNullishOr(options.cover),
  startAt: Option.fromNullishOr(options.startAt),
  supportsStreaming: options.supportsStreaming ?? false,
})

export const animation = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    layout?: 'caption-above' | 'caption-below'
    spoiler?: boolean
    duration?: Duration.Duration
    width?: number
    height?: number
    thumbnail?: File.InputFile
  },
): Animation => ({
  _tag: 'Animation',
  file,
  caption: Option.fromNullishOr(options.caption),
  layout: options.layout ?? 'caption-below',
  spoiler: options.spoiler ?? false,
  duration: Option.fromNullishOr(options.duration),
  width: Option.fromNullishOr(options.width),
  height: Option.fromNullishOr(options.height),
  thumbnail: Option.fromNullishOr(options.thumbnail),
})

export const voice = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    duration?: Duration.Duration
  },
): Voice => ({
  _tag: 'Voice',
  file,
  caption: Option.fromNullishOr(options.caption),
  duration: Option.fromNullishOr(options.duration),
})

export const videoNote = (
  file: File.FileId | File.InputFile,
  options: {
    duration?: Duration.Duration
    diameter?: number
    thumbnail?: File.InputFile
  },
): VideoNote => ({
  _tag: 'VideoNote',
  file,
  duration: Option.fromNullishOr(options.duration),
  diameter: Option.fromNullishOr(options.diameter),
  thumbnail: Option.fromNullishOr(options.thumbnail),
})

export const location = (options: {
  latitude: number
  longitude: number
  uncertaintyRadius?: number
}): Location => ({
  _tag: 'Location',
  latitude: options.latitude,
  longitude: options.longitude,
  uncertaintyRadius: Option.fromNullishOr(options.uncertaintyRadius),
  livePeriod: Option.none(),
  heading: Option.none(),
  proximityAlertRadius: Option.none(),
})

export const liveLocation = (options: {
  latitude: number
  longitude: number
  uncertaintyRadius?: number
  livePeriod: Duration.Duration
  heading?: number
  proximityAlertRadius?: number
}): Location => ({
  _tag: 'Location',
  latitude: options.latitude,
  longitude: options.longitude,
  uncertaintyRadius: Option.fromNullishOr(options.uncertaintyRadius),
  livePeriod: Option.some(options.livePeriod),
  heading: Option.fromNullishOr(options.heading),
  proximityAlertRadius: Option.fromNullishOr(options.proximityAlertRadius),
})

export const venue = (options: {
  latitude: number
  longitude: number
  title: string
  address: string
  foursquareId?: string
  foursquareType?: string
  googlePlaceId?: string
  googlePlaceType?: string
}): Venue => ({
  _tag: 'Venue',
  latitude: options.latitude,
  longitude: options.longitude,
  title: options.title,
  address: options.address,
  foursquareId: Option.fromNullishOr(options.foursquareId),
  foursquareType: Option.fromNullishOr(options.foursquareType),
  googlePlaceId: Option.fromNullishOr(options.googlePlaceId),
  googlePlaceType: Option.fromNullishOr(options.googlePlaceType),
})

export const contact = (options: {
  phoneNumber: string
  firstName: string
  lastName?: string
  vcard?: string
}): Contact => ({
  _tag: 'Contact',
  phoneNumber: options.phoneNumber,
  firstName: options.firstName,
  lastName: Option.fromNullishOr(options.lastName),
  vcard: Option.fromNullishOr(options.vcard),
})

export const dice = (emoji: Dice['emoji']): Dice => ({ _tag: 'Dice', emoji })

export const sticker = (
  file: File.FileId | File.External | File.InputFile,
  emoji?: string,
): Sticker => ({ _tag: 'Sticker', file, emoji: Option.fromNullishOr(emoji) })
