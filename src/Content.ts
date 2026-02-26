import type * as Duration from 'effect/Duration'
import type * as File from './File.ts'
import type * as LinkPreview from './LinkPreview.ts'
import type * as Text_ from './Text.ts'
import * as Data from 'effect/Data'
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
 * Content of a text message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_text.html TDLib • td_api.inputMessageText}
 * @see {@link https://core.telegram.org/bots/api#sendmessage Bot API • sendMessage}
 */
const _Text: ReturnType<typeof Data.TaggedClass<'Text'>> = Data.TaggedClass('Text')
export class Text extends _Text<{
  text: Text_.Text
  linkPreview: Option.Option<LinkPreview.LinkPreview>
}> {}

/**
 * Content of a photo message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_photo.html TDLib • td_api.inputMessagePhoto}
 * @see {@link https://core.telegram.org/bots/api#sendphoto Bot API • sendPhoto}
 */
const _Photo: ReturnType<typeof Data.TaggedClass<'Photo'>> = Data.TaggedClass('Photo')
export class Photo extends _Photo<{
  file: File.FileId | File.External | File.InputFile
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
const _Audio: ReturnType<typeof Data.TaggedClass<'Audio'>> = Data.TaggedClass('Audio')
export class Audio extends _Audio<{
  file: File.FileId | File.External | File.InputFile
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
const _Document: ReturnType<typeof Data.TaggedClass<'Document'>> = Data.TaggedClass('Document')
export class Document extends _Document<{
  file: File.FileId | File.External | File.InputFile
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
const _Video: ReturnType<typeof Data.TaggedClass<'Video'>> = Data.TaggedClass('Video')
export class Video extends _Video<{
  file: File.FileId | File.External | File.InputFile
  caption: Option.Option<Text_.Text>
  layout: 'caption-above' | 'caption-below'
  spoiler: boolean
  duration: Option.Option<Duration.Duration>
  width: Option.Option<number>
  height: Option.Option<number>
  thumbnail: Option.Option<File.InputFile>
  cover: Option.Option<File.FileId | File.External | File.InputFile>
  startAt: Option.Option<Duration.Duration>
  supportsStreaming: boolean
}> {}

/**
 * Content of an animation message (GIF or video without sound).
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_animation.html TDLib • td_api.inputMessageAnimation}
 * @see {@link https://core.telegram.org/bots/api#sendanimation Bot API • sendAnimation}
 */
const _Animation: ReturnType<typeof Data.TaggedClass<'Animation'>> = Data.TaggedClass('Animation')
export class Animation extends _Animation<{
  file: File.FileId | File.External | File.InputFile
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
const _Voice: ReturnType<typeof Data.TaggedClass<'Voice'>> = Data.TaggedClass('Voice')
export class Voice extends _Voice<{
  file: File.FileId | File.External | File.InputFile
  caption: Option.Option<Text_.Text>
  duration: Option.Option<Duration.Duration>
}> {}

/**
 * Content of a video note message (round video).
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_video_note.html TDLib • td_api.inputMessageVideoNote}
 * @see {@link https://core.telegram.org/bots/api#sendvideonote Bot API • sendVideoNote}
 */
const _VideoNote: ReturnType<typeof Data.TaggedClass<'VideoNote'>> = Data.TaggedClass('VideoNote')
export class VideoNote extends _VideoNote<{
  file: File.FileId | File.InputFile
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
const _Location: ReturnType<typeof Data.TaggedClass<'Location'>> = Data.TaggedClass('Location')
export class Location extends _Location<{
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
const _Venue: ReturnType<typeof Data.TaggedClass<'Venue'>> = Data.TaggedClass('Venue')
export class Venue extends _Venue<{
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
const _Contact: ReturnType<typeof Data.TaggedClass<'Contact'>> = Data.TaggedClass('Contact')
export class Contact extends _Contact<{
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
const _Dice: ReturnType<typeof Data.TaggedClass<'Dice'>> = Data.TaggedClass('Dice')
export class Dice extends _Dice<{
  emoji: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
}> {}

/**
 * Content of a sticker message.
 *
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_sticker.html TDLib • td_api.inputMessageSticker}
 * @see {@link https://core.telegram.org/bots/api#sendsticker Bot API • sendSticker}
 */
const _Sticker: ReturnType<typeof Data.TaggedClass<'Sticker'>> = Data.TaggedClass('Sticker')
export class Sticker extends _Sticker<{
  file: File.FileId | File.External | File.InputFile
  emoji: Option.Option<string>
}> {}

// ——— Constructors ——————————————————————————————————————————————————————————

export const text = (
  text: Text_.Text,
  options?: {
    linkPreview?: LinkPreview.LinkPreview
  },
): Text => new Text({
  text,
  linkPreview: Option.fromNullable(options?.linkPreview),
})

export const photo = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    layout?: 'caption-above' | 'caption-below'
    spoiler?: boolean
  },
): Photo => new Photo({
  file,
  caption: Option.fromNullable(options.caption),
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
): Audio => new Audio({
  file,
  caption: Option.fromNullable(options.caption),
  duration: Option.fromNullable(options.duration),
  performer: Option.fromNullable(options.performer),
  title: Option.fromNullable(options.title),
  thumbnail: Option.fromNullable(options.thumbnail),
})

export const document = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    thumbnail?: File.InputFile
    contentTypeDetection?: boolean
  },
): Document => new Document({
  file,
  caption: Option.fromNullable(options.caption),
  thumbnail: Option.fromNullable(options.thumbnail),
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
): Video => new Video({
  file,
  caption: Option.fromNullable(options.caption),
  layout: options.layout ?? 'caption-below',
  spoiler: options.spoiler ?? false,
  duration: Option.fromNullable(options.duration),
  width: Option.fromNullable(options.width),
  height: Option.fromNullable(options.height),
  thumbnail: Option.fromNullable(options.thumbnail),
  cover: Option.fromNullable(options.cover),
  startAt: Option.fromNullable(options.startAt),
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
): Animation => new Animation({
  file,
  caption: Option.fromNullable(options.caption),
  layout: options.layout ?? 'caption-below',
  spoiler: options.spoiler ?? false,
  duration: Option.fromNullable(options.duration),
  width: Option.fromNullable(options.width),
  height: Option.fromNullable(options.height),
  thumbnail: Option.fromNullable(options.thumbnail),
})

export const voice = (
  file: File.FileId | File.External | File.InputFile,
  options: {
    caption?: Text_.Text
    duration?: Duration.Duration
  },
): Voice => new Voice({
  file,
  caption: Option.fromNullable(options.caption),
  duration: Option.fromNullable(options.duration),
})

export const videoNote = (
  file: File.FileId | File.InputFile,
  options: {
    duration?: Duration.Duration
    diameter?: number
    thumbnail?: File.InputFile
  },
): VideoNote => new VideoNote({
  file,
  duration: Option.fromNullable(options.duration),
  diameter: Option.fromNullable(options.diameter),
  thumbnail: Option.fromNullable(options.thumbnail),
})

export const location = (options: {
  latitude: number
  longitude: number
  uncertaintyRadius?: number
}): Location => new Location({
  latitude: options.latitude,
  longitude: options.longitude,
  uncertaintyRadius: Option.fromNullable(options.uncertaintyRadius),
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
}): Location => new Location({
  latitude: options.latitude,
  longitude: options.longitude,
  uncertaintyRadius: Option.fromNullable(options.uncertaintyRadius),
  livePeriod: Option.some(options.livePeriod),
  heading: Option.fromNullable(options.heading),
  proximityAlertRadius: Option.fromNullable(options.proximityAlertRadius),
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
}): Venue => new Venue({
  latitude: options.latitude,
  longitude: options.longitude,
  title: options.title,
  address: options.address,
  foursquareId: Option.fromNullable(options.foursquareId),
  foursquareType: Option.fromNullable(options.foursquareType),
  googlePlaceId: Option.fromNullable(options.googlePlaceId),
  googlePlaceType: Option.fromNullable(options.googlePlaceType),
})

export const contact = (options: {
  phoneNumber: string
  firstName: string
  lastName?: string
  vcard?: string
}): Contact => new Contact({
  phoneNumber: options.phoneNumber,
  firstName: options.firstName,
  lastName: Option.fromNullable(options.lastName),
  vcard: Option.fromNullable(options.vcard),
})

export const dice = (emoji: Dice['emoji']): Dice => new Dice({ emoji })

export const sticker = (
  file: File.FileId | File.External | File.InputFile,
  emoji?: string,
): Sticker => new Sticker({ file, emoji: Option.fromNullable(emoji) })
