import type * as Content from '../Content.ts'
import type * as Dialog from '../Dialog.ts'
import type * as Dialog_ from '../Dialog.ts'
import type * as Markup from '../Markup.ts'
import type * as Send from '../Send.ts'
import type * as Text from '../Text.ts'
import * as Tgx from '@grom.js/tgx'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Function from 'effect/Function'
import * as Match from 'effect/Match'
import * as Option from 'effect/Option'
import * as BotApi from '../BotApi.ts'
import * as LinkPreview from '../LinkPreview.ts'

type ParamsText = PickMethodParams<'sendMessage', 'text' | 'entities' | 'parse_mode'>
const paramsText: (text: Text.Text) => ParamsText = Function.pipe(
  Match.type<Text.Text>(),
  Match.withReturnType<ParamsText>(),
  Match.tags({
    Plain: ({ text, entities }) => ({ text, entities }),
    Html: ({ html }) => ({ text: html, parse_mode: 'HTML' }),
    Markdown: ({ markdown }) => ({ text: markdown, parse_mode: 'MarkdownV2' }),
    Tgx: ({ tgx }) => ({ text: Tgx.html(tgx), parse_mode: 'HTML' }),
  }),
  Match.exhaustive,
)

type ParamsCaption = PickMethodParams<'sendPhoto', 'caption' | 'caption_entities' | 'parse_mode'>
const paramsCaption = (caption: Option.Option<Text.Text>): ParamsCaption => (
  Option.match(caption, {
    onNone: () => ({}),
    onSome: (caption) => {
      const { text, entities, parse_mode } = paramsText(caption)
      return { caption: text, caption_entities: entities, parse_mode }
    },
  })
)

type ParamsContentText = PickMethodParams<'sendMessage', 'text' | 'entities' | 'parse_mode' | 'link_preview_options'>
type ParamsContentPhoto = PickMethodParams<'sendPhoto', 'photo' | 'caption' | 'caption_entities' | 'parse_mode' | 'show_caption_above_media' | 'has_spoiler'>
type ParamsContentAudio = PickMethodParams<'sendAudio', 'audio' | 'caption' | 'caption_entities' | 'parse_mode' | 'duration' | 'performer' | 'title' | 'thumbnail'>
type ParamsContentDocument = PickMethodParams<'sendDocument', 'document' | 'thumbnail' | 'caption' | 'parse_mode' | 'caption_entities' | 'disable_content_type_detection'>
type ParamsContentVideo = PickMethodParams<'sendVideo', 'video' | 'duration' | 'width' | 'height' | 'thumbnail' | 'cover' | 'start_timestamp' | 'show_caption_above_media' | 'has_spoiler' | 'supports_streaming'>
type ParamsContentAnimation = PickMethodParams<'sendAnimation', 'animation' | 'duration' | 'width' | 'height' | 'thumbnail' | 'has_spoiler'>
type ParamsContentVoice = PickMethodParams<'sendVoice', 'voice' | 'duration'>
type ParamsContentVideoNote = PickMethodParams<'sendVideoNote', 'video_note' | 'duration' | 'length' | 'thumbnail'>
type ParamsContentLocation = PickMethodParams<'sendLocation', 'latitude' | 'longitude' | 'horizontal_accuracy' | 'live_period' | 'heading' | 'proximity_alert_radius'>
type ParamsContentVenue = PickMethodParams<'sendVenue', 'latitude' | 'longitude' | 'title' | 'address' | 'foursquare_id' | 'foursquare_type' | 'google_place_id' | 'google_place_type'>
type ParamsContentContact = PickMethodParams<'sendContact', 'phone_number' | 'first_name' | 'last_name' | 'vcard'>
type ParamsContentDice = PickMethodParams<'sendDice', 'emoji'>
type ParamsContentSticker = PickMethodParams<'sendSticker', 'sticker' | 'emoji'>
const paramsContent: {
  (content: Content.Text): ParamsContentText
  (content: Content.Photo): ParamsContentPhoto
  (content: Content.Audio): ParamsContentAudio
  (content: Content.Document): ParamsContentDocument
  (content: Content.Video): ParamsContentVideo
  (content: Content.Animation): ParamsContentAnimation
  (content: Content.Voice): ParamsContentVoice
  (content: Content.VideoNote): ParamsContentVideoNote
  (content: Content.Location): ParamsContentLocation
  (content: Content.Venue): ParamsContentVenue
  (content: Content.Contact): ParamsContentContact
  (content: Content.Dice): ParamsContentDice
  (content: Content.Sticker): ParamsContentSticker
} = Function.pipe(
  Match.type<Content.Content>(),
  Match.tags({
    Text: ({ text, linkPreview }): ParamsContentText => ({
      ...paramsText(text),
      link_preview_options: Option.match(linkPreview, {
        onNone: () => ({ is_disabled: true }),
        onSome: linkPreview => LinkPreview.options(linkPreview),
      }),
    }),
    Photo: ({ file, caption, layout, spoiler }): ParamsContentPhoto => ({
      ...paramsCaption(caption),
      photo: file instanceof URL ? file.toString() : file,
      show_caption_above_media: layout === 'caption-above',
      has_spoiler: spoiler,
    }),
    Audio: ({ file, caption, duration, performer, title, thumbnail }): ParamsContentAudio => ({
      ...paramsCaption(caption),
      audio: file instanceof URL ? file.toString() : file,
      duration: Option.match(duration, {
        onNone: () => undefined,
        onSome: duration => Math.round(Duration.toSeconds(duration)),
      }),
      performer: Option.getOrUndefined(performer),
      title: Option.getOrUndefined(title),
      thumbnail: Option.getOrUndefined(thumbnail),
    }),
    Document: ({ file, caption, thumbnail, contentTypeDetection }): ParamsContentDocument => ({
      ...paramsCaption(caption),
      document: file instanceof URL ? file.toString() : file,
      thumbnail: Option.getOrUndefined(thumbnail),
      disable_content_type_detection: !contentTypeDetection,
    }),
    Video: ({ file, caption, layout, spoiler, duration, width, height, thumbnail, cover, startAt, supportsStreaming }): ParamsContentVideo => ({
      ...paramsCaption(caption),
      video: file instanceof URL ? file.toString() : file,
      duration: Option.match(duration, {
        onNone: () => undefined,
        onSome: duration => Math.round(Duration.toSeconds(duration)),
      }),
      width: Option.getOrUndefined(width),
      height: Option.getOrUndefined(height),
      thumbnail: Option.getOrUndefined(thumbnail),
      cover: Option.map(cover, c => c instanceof URL ? c.toString() : c).pipe(Option.getOrUndefined),
      start_timestamp: Option.match(startAt, {
        onNone: () => undefined,
        onSome: startAt => Math.round(Duration.toSeconds(startAt)),
      }),
      show_caption_above_media: layout === 'caption-above',
      has_spoiler: spoiler,
      supports_streaming: supportsStreaming,
    }),
    Animation: ({ file, caption, spoiler, duration, width, height, thumbnail }): ParamsContentAnimation => ({
      ...paramsCaption(caption),
      animation: file instanceof URL ? file.toString() : file,
      duration: Option.match(duration, {
        onNone: () => undefined,
        onSome: duration => Math.round(Duration.toSeconds(duration)),
      }),
      width: Option.getOrUndefined(width),
      height: Option.getOrUndefined(height),
      thumbnail: Option.getOrUndefined(thumbnail),
      has_spoiler: spoiler,
    }),
    Voice: ({ file, caption, duration }): ParamsContentVoice => ({
      ...paramsCaption(caption),
      voice: file instanceof URL ? file.toString() : file,
      duration: Option.match(duration, {
        onNone: () => undefined,
        onSome: duration => Math.round(Duration.toSeconds(duration)),
      }),
    }),
    VideoNote: ({ file, duration, diameter, thumbnail }): ParamsContentVideoNote => ({
      video_note: file,
      duration: Option.match(duration, {
        onNone: () => undefined,
        onSome: duration => Math.round(Duration.toSeconds(duration)),
      }),
      length: Option.getOrUndefined(diameter),
      thumbnail: Option.getOrUndefined(thumbnail),
    }),
    Location: ({ latitude, longitude, uncertaintyRadius, livePeriod, heading, proximityAlertRadius }): ParamsContentLocation => ({
      latitude,
      longitude,
      horizontal_accuracy: Option.getOrUndefined(uncertaintyRadius),
      live_period: Option.match(livePeriod, {
        onNone: () => undefined,
        onSome: livePeriod => Duration.isFinite(livePeriod)
          ? Math.round(Duration.toSeconds(livePeriod))
          : 0x7FFFFFFF,
      }),
      heading: Option.getOrUndefined(heading),
      proximity_alert_radius: Option.getOrUndefined(proximityAlertRadius),
    }),
    Venue: ({ latitude, longitude, title, address, foursquareId, foursquareType, googlePlaceId, googlePlaceType }): ParamsContentVenue => ({
      latitude,
      longitude,
      title,
      address,
      foursquare_id: Option.getOrUndefined(foursquareId),
      foursquare_type: Option.getOrUndefined(foursquareType),
      google_place_id: Option.getOrUndefined(googlePlaceId),
      google_place_type: Option.getOrUndefined(googlePlaceType),
    }),
    Contact: ({ phoneNumber, firstName, lastName, vcard }): ParamsContentContact => ({
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: Option.getOrUndefined(lastName),
      vcard: Option.getOrUndefined(vcard),
    }),
    Dice: ({ emoji }): ParamsContentDice => ({
      emoji,
    }),
    Sticker: ({ file, emoji }): ParamsContentSticker => ({
      sticker: file instanceof URL ? file.toString() : file,
      emoji: Option.getOrUndefined(emoji),
    }),
  }),
  Match.exhaustive,
) as any

type ParamsDialog = PickMethodParams<SendMethod, 'chat_id' | 'message_thread_id' | 'direct_messages_topic_id'>
const paramsDialog: (dialog: Dialog.Dialog) => ParamsDialog = Function.pipe(
  Match.type<Dialog.Dialog>(),
  Match.withReturnType<ParamsDialog>(),
  Match.tagsExhaustive({
    User: user => ({ chat_id: user.dialogId() }),
    Group: group => ({ chat_id: group.dialogId() }),
    Supergroup: supergroup => ({ chat_id: supergroup.dialogId() }),
    Channel: channel => ({ chat_id: channel.dialogId() }),
    PrivateTopic: topic => ({
      chat_id: topic.user.dialogId(),
      message_thread_id: topic.topicId,
    }),
    ForumTopic: topic => ({
      chat_id: topic.supergroup.dialogId(),
      message_thread_id: topic.topicId,
    }),
    ChannelDm: dm => ({
      chat_id: dm.channel.dialogId(),
      direct_messages_topic_id: dm.topicId,
    }),
  }),
)

type ParamsOptions = PickMethodParams<SendMethod, 'disable_notification' | 'protect_content' | 'allow_paid_broadcast'>
const paramsOptions = (options: Send.Options): ParamsOptions => {
  return {
    disable_notification: options.disableNotification || undefined,
    protect_content: options.protectContent || undefined,
    allow_paid_broadcast: options.allowPaidBroadcast || undefined,
  }
}

type ParamsMarkup = PickMethodParams<SendMethod, 'reply_markup'>
const paramsMarkup: (markup: Markup.Markup) => ParamsMarkup = Function.pipe(
  Match.type<Markup.Markup>(),
  Match.withReturnType<ParamsMarkup>(),
  Match.tagsExhaustive({
    InlineKeyboard: markup => ({
      reply_markup: {
        inline_keyboard: markup.rows, // TODO
      },
    }),
    ReplyKeyboard: markup => ({
      reply_markup: {
        keyboard: markup.rows, // TODO
        is_persistent: markup.persistent,
        resize_keyboard: markup.resizable,
        one_time_keyboard: markup.oneTime,
        input_field_placeholder: Option.getOrUndefined(markup.inputPlaceholder),
        selective: markup.selective,
      },
    }),
    ReplyKeyboardRemove: markup => ({
      reply_markup: {
        remove_keyboard: true,
        selective: markup.selective,
      },
    }),
    ForceReply: markup => ({
      reply_markup: {
        force_reply: true,
        input_field_placeholder: Option.getOrUndefined(markup.inputPlaceholder),
        selective: markup.selective,
      },
    }),
  }),
)

type PickMethodParams<
  TMethod extends keyof BotApi.MethodParams,
  TPick extends keyof BotApi.MethodParams[TMethod],
> = Pick<BotApi.MethodParams[TMethod], TPick>

type SendMethod = Extract<
  keyof BotApi.MethodParams,
  | 'sendMessage'
  | 'sendPhoto'
  | 'sendAudio'
  | 'sendDocument'
  | 'sendVideo'
  | 'sendAnimation'
  | 'sendVoice'
  | 'sendVideoNote'
  | 'sendPaidMedia'
  | 'sendLocation'
  | 'sendVenue'
  | 'sendContact'
  | 'sendDice'
  | 'sendSticker'
  | 'sendInvoice'
>

export const sendMessage = Effect.fnUntraced(function* (params: {
  content: Content.Content
  dialog: Dialog_.Dialog
  options?: Send.Options
  markup?: Markup.Markup
}) {
  const api = yield* BotApi.BotApi
  const common = {
    ...paramsDialog(params.dialog),
    ...(params.options ? paramsOptions(params.options) : {}),
    ...(params.markup ? paramsMarkup(params.markup) : {}),
  }
  return yield* Match.value(params.content).pipe(
    Match.tagsExhaustive({
      Text: content => api.sendMessage({ ...common, ...paramsContent(content) }),
      Photo: content => api.sendPhoto({ ...common, ...paramsContent(content) }),
      Audio: content => api.sendAudio({ ...common, ...paramsContent(content) }),
      Document: content => api.sendDocument({ ...common, ...paramsContent(content) }),
      Video: content => api.sendVideo({ ...common, ...paramsContent(content) }),
      Animation: content => api.sendAnimation({ ...common, ...paramsContent(content) }),
      Voice: content => api.sendVoice({ ...common, ...paramsContent(content) }),
      VideoNote: content => api.sendVideoNote({ ...common, ...paramsContent(content) }),
      Location: content => api.sendLocation({ ...common, ...paramsContent(content) }),
      Venue: content => api.sendVenue({ ...common, ...paramsContent(content) }),
      Contact: content => api.sendContact({ ...common, ...paramsContent(content) }),
      Dice: content => api.sendDice({ ...common, ...paramsContent(content) }),
      Sticker: content => api.sendSticker({ ...common, ...paramsContent(content) }),
    }),
  )
})
