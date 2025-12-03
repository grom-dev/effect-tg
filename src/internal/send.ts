import type * as BotApi from '../BotApi.ts'
import type * as Content from '../Content.ts'
import type * as Dialog from '../Dialog.ts'
import type * as Send from '../Send.ts'
import type * as Text from '../Text.ts'
import * as Tgx from '@grom.js/tgx'
import * as Function from 'effect/Function'
import * as Match from 'effect/Match'
import * as Option from 'effect/Option'

export type ParamsText = PickMethodParams<'sendMessage', 'text' | 'entities' | 'parse_mode'>
export const paramsText: (text: Text.Text) => ParamsText = Function.pipe(
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

export const paramsContent: {
  (content: Content.Text): PickMethodParams<'sendMessage', 'text' | 'entities' | 'parse_mode' | 'link_preview_options'>
  (content: Content.Photo): PickMethodParams<'sendPhoto', 'photo' | 'caption' | 'caption_entities' | 'parse_mode' | 'show_caption_above_media' | 'has_spoiler'>
} = Function.pipe(
  Match.type<Content.Content>(),
  Match.tagsExhaustive({
    Text: ({ text, linkPreview }) => ({
      ...paramsText(text),
      link_preview_options: Option.match(linkPreview, {
        onNone: () => ({ is_disabled: true }),
        onSome: lp => lp.options(),
      }),
    }),
    Photo: ({ caption, layout, spoiler }) => ({
      // TODO: file
      ...Option.match(caption, {
        onNone: () => ({}),
        onSome: (caption) => {
          const { text, entities, parse_mode } = paramsText(caption)
          return { caption: text, caption_entities: entities, parse_mode }
        },
      }),
      show_caption_above_media: layout === 'caption-above',
      has_spoiler: spoiler,
    }),
  }),
) as any

export type ParamsDialog = PickMethodParams<SendMethod, 'chat_id' | 'message_thread_id' | 'direct_messages_topic_id'>
export const paramsDialog: (dialog: Dialog.Dialog) => ParamsDialog = Function.pipe(
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

export type ParamsOptions = PickMethodParams<SendMethod, 'disable_notification' | 'protect_content' | 'allow_paid_broadcast'>
export const paramsOptions = (options: Send.Options): ParamsOptions => {
  return {
    disable_notification: options.disableNotification || undefined,
    protect_content: options.protectContent || undefined,
    allow_paid_broadcast: options.allowPaidBroadcast || undefined,
  }
}

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
  | 'sendPaidMedia'
  | 'sendContact'
  | 'sendLocation'
  | 'sendVenue'
  | 'sendInvoice'
>

type PickMethodParams<
  TMethod extends keyof BotApi.MethodParams,
  TPick extends keyof BotApi.MethodParams[TMethod],
> = Pick<BotApi.MethodParams[TMethod], TPick>
