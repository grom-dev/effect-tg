import type * as Content from '../Content.ts'
import type * as Dialog from '../Dialog.ts'
import type * as Dialog_ from '../Dialog.ts'
import type * as Markup from '../Markup.ts'
import type * as Send from '../Send.ts'
import type * as Text from '../Text.ts'
import * as Tgx from '@grom.js/tgx'
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

type ParamsContentText = PickMethodParams<'sendMessage', 'text' | 'entities' | 'parse_mode' | 'link_preview_options'>
type ParamsContentPhoto = PickMethodParams<'sendPhoto', 'photo' | 'caption' | 'caption_entities' | 'parse_mode' | 'show_caption_above_media' | 'has_spoiler'>
const paramsContent: {
  (content: Content.Text): ParamsContentText
  (content: Content.Photo): ParamsContentPhoto
} = Function.pipe(
  Match.type<Content.Content>(),
  Match.tagsExhaustive({
    Text: ({ text, linkPreview }): ParamsContentText => ({
      ...paramsText(text),
      link_preview_options: Option.match(linkPreview, {
        onNone: () => ({ is_disabled: true }),
        onSome: linkPreview => LinkPreview.options(linkPreview),
      }),
    }),
    Photo: ({ file, caption, layout, spoiler }): ParamsContentPhoto => ({
      ...Option.match(caption, {
        onNone: () => ({}),
        onSome: (caption) => {
          const { text, entities, parse_mode } = paramsText(caption)
          return { caption: text, caption_entities: entities, parse_mode }
        },
      }),
      photo: file instanceof URL ? file.toString() : file,
      show_caption_above_media: layout === 'caption-above',
      has_spoiler: spoiler,
    }),
  }),
) as any

type ParamsDialog = PickMethodParams<SendMethod, 'chat_id' | 'message_thread_id' | 'direct_messages_topic_id'>
const paramsDialog: (dialog: Dialog.Dialog) => ParamsDialog = Function.pipe(
  Match.type<Dialog.Dialog>(),
  Match.withReturnType<ParamsDialog>(),
  Match.tagsExhaustive({
    UserId: ({ dialogId }) => ({ chat_id: dialogId }),
    GroupId: ({ dialogId }) => ({ chat_id: dialogId }),
    ChannelId: ({ dialogId }) => ({ chat_id: dialogId }),
    SupergroupId: ({ dialogId }) => ({ chat_id: dialogId }),
    PublicChannel: ({ username }) => ({ chat_id: username }),
    PublicSupergroup: ({ username }) => ({ chat_id: username }),
    ForumTopic: ({ forum, topicId }) => ({
      chat_id: Match.value(forum).pipe(
        Match.tagsExhaustive({
          SupergroupId: ({ dialogId }) => dialogId,
          PublicSupergroup: ({ username }) => username,
        }),
      ),
      message_thread_id: topicId,
    }),
    ChannelDm: ({ channel, userId }) => ({
      chat_id: Match.value(channel).pipe(
        Match.tagsExhaustive({
          ChannelId: ({ dialogId }) => dialogId,
          PublicChannel: ({ username }) => username,
        }),
      ),
      direct_messages_topic_id: userId,
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
  | 'sendVideo'
  | 'sendAudio'
  | 'sendDocument'
  | 'sendVoice'
  | 'sendVideoNote'
  | 'sendAnimation'
  | 'sendSticker'
  | 'sendDice'
  | 'sendContact'
  | 'sendLocation'
  | 'sendVenue'
  | 'sendInvoice'
  | 'sendPaidMedia'
>

export const sendMessage = Effect.fnUntraced(
  function* (params: {
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
        Text: text => api.sendMessage({ ...common, ...paramsContent(text) }),
        Photo: photo => api.sendPhoto({ ...common, ...paramsContent(photo) }),
      }),
    )
  },
)
