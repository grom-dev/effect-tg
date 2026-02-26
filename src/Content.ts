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
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_text.html TDLib • td_api.inputMessageText}
 * @see {@link https://core.telegram.org/bots/api#sendmessage Bot API • sendMessage}
 */
export interface Text {
  readonly _tag: 'Text'
  readonly text: Text_.Text
  readonly linkPreview: Option.Option<LinkPreview.LinkPreview>
}
export const Text: Data.Case.Constructor<Text, '_tag'> = Data.tagged<Text>('Text')

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
export const Photo: Data.Case.Constructor<Photo, '_tag'> = Data.tagged<Photo>('Photo')

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
export const Audio: Data.Case.Constructor<Audio, '_tag'> = Data.tagged<Audio>('Audio')

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
export const Document: Data.Case.Constructor<Document, '_tag'> = Data.tagged<Document>('Document')

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
export const Video: Data.Case.Constructor<Video, '_tag'> = Data.tagged<Video>('Video')

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
export const Animation: Data.Case.Constructor<Animation, '_tag'> = Data.tagged<Animation>('Animation')

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
export const Voice: Data.Case.Constructor<Voice, '_tag'> = Data.tagged<Voice>('Voice')

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
export const VideoNote: Data.Case.Constructor<VideoNote, '_tag'> = Data.tagged<VideoNote>('VideoNote')

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
export const Location: Data.Case.Constructor<Location, '_tag'> = Data.tagged<Location>('Location')

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
export const Venue: Data.Case.Constructor<Venue, '_tag'> = Data.tagged<Venue>('Venue')

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
export const Contact: Data.Case.Constructor<Contact, '_tag'> = Data.tagged<Contact>('Contact')

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_dice.html TDLib • td_api.inputMessageDice}
 * @see {@link https://core.telegram.org/bots/api#senddice Bot API • sendDice}
 */
export interface Dice {
  readonly _tag: 'Dice'
  readonly emoji: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
}
export const Dice: Data.Case.Constructor<Dice, '_tag'> = Data.tagged<Dice>('Dice')

/**
 * @see {@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1input_message_sticker.html TDLib • td_api.inputMessageSticker}
 * @see {@link https://core.telegram.org/bots/api#sendsticker Bot API • sendSticker}
 */
export interface Sticker {
  readonly _tag: 'Sticker'
  readonly file: File.FileId | File.External | File.InputFile
  readonly emoji: Option.Option<string>
}
export const Sticker: Data.Case.Constructor<Sticker, '_tag'> = Data.tagged<Sticker>('Sticker')

// ——— Constructors ——————————————————————————————————————————————————————————

export const text = (
  text: Text_.Text,
  options?: {
    linkPreview?: LinkPreview.LinkPreview
  },
): Text => Text({
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
): Photo => Photo({
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
): Audio => Audio({
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
): Document => Document({
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
): Video => Video({
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
): Animation => Animation({
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
): Voice => Voice({
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
): VideoNote => VideoNote({
  file,
  duration: Option.fromNullable(options.duration),
  diameter: Option.fromNullable(options.diameter),
  thumbnail: Option.fromNullable(options.thumbnail),
})

export const location = (options: {
  latitude: number
  longitude: number
  uncertaintyRadius?: number
}): Location => Location({
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
}): Location => Location({
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
}): Venue => Venue({
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
}): Contact => Contact({
  phoneNumber: options.phoneNumber,
  firstName: options.firstName,
  lastName: Option.fromNullable(options.lastName),
  vcard: Option.fromNullable(options.vcard),
})

export const dice = (emoji: Dice['emoji']): Dice => Dice({ emoji })

export const sticker = (
  file: File.FileId | File.External | File.InputFile,
  emoji?: string,
): Sticker => Sticker({ file, emoji: Option.fromNullable(emoji) })
