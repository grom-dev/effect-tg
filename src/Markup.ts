import * as Data from 'effect/Data'
import * as Option from 'effect/Option'

// =============================================================================
// Markup
// =============================================================================

/**
 * Reply markup for the message.
 */
export type Markup =
  | InlineKeyboard
  | ReplyKeyboard
  | ReplyKeyboardRemove
  | ForceReply

export class InlineKeyboard extends Data.TaggedClass('InlineKeyboard')<{
  readonly rows: ReadonlyArray<ReadonlyArray<InlineButton>>
}> {}

export class ReplyKeyboard extends Data.TaggedClass('ReplyKeyboard')<{
  readonly rows: ReadonlyArray<ReadonlyArray<ReplyButton>>
  readonly persistent: boolean
  readonly resizable: boolean
  readonly oneTime: boolean
  readonly selective: boolean
  readonly inputPlaceholder: Option.Option<string>
}> {}

export class ReplyKeyboardRemove extends Data.TaggedClass('ReplyKeyboardRemove')<{
  readonly selective: boolean
}> {}

export class ForceReply extends Data.TaggedClass('ForceReply')<{
  readonly selective: boolean
  readonly inputPlaceholder: Option.Option<string>
}> {}

// =============================================================================
// Constructors
// =============================================================================

export const inlineKeyboard = (
  rows: ReadonlyArray<ReadonlyArray<InlineButton>>,
): InlineKeyboard => new InlineKeyboard({ rows })

export const replyKeyboard = (
  rows: ReadonlyArray<ReadonlyArray<ReplyButton>>,
  options?: {
    readonly persistent?: boolean
    readonly resizable?: boolean
    readonly oneTime?: boolean
    readonly selective?: boolean
    readonly inputPlaceholder?: string
  },
): ReplyKeyboard =>
  new ReplyKeyboard({
    rows,
    persistent: options?.persistent ?? false,
    resizable: options?.resizable ?? false,
    oneTime: options?.oneTime ?? false,
    selective: options?.selective ?? false,
    inputPlaceholder: Option.fromNullable(options?.inputPlaceholder),
  })

export const replyKeyboardRemove = (options?: { readonly selective?: boolean }): ReplyKeyboardRemove =>
  new ReplyKeyboardRemove({ selective: options?.selective ?? false })

export const forceReply = (options?: {
  readonly selective?: boolean
  readonly inputPlaceholder?: string
}): ForceReply =>
  new ForceReply({
    selective: options?.selective ?? false,
    inputPlaceholder: Option.fromNullable(options?.inputPlaceholder),
  })

// =============================================================================
// Inline button
// =============================================================================

/**
 * Button of an inline keyboard.
 *
 * Exactly one action field must be specified per button.
 */
export type InlineButton =
  | { readonly text: string, readonly url: string } & ButtonAppearance
  | { readonly text: string, readonly callbackData: string } & ButtonAppearance
  | { readonly text: string, readonly webApp: WebAppInfo } & ButtonAppearance
  | { readonly text: string, readonly loginUrl: LoginUrl } & ButtonAppearance
  | { readonly text: string, readonly switchInlineQuery: string } & ButtonAppearance
  | { readonly text: string, readonly switchInlineQueryCurrentChat: string } & ButtonAppearance
  | { readonly text: string, readonly switchInlineQueryChosenChat: SwitchInlineQueryChosenChat } & ButtonAppearance
  | { readonly text: string, readonly copyText: string } & ButtonAppearance
  | { readonly text: string, readonly callbackGame: CallbackGame } & ButtonAppearance
  | { readonly text: string, readonly pay: true } & ButtonAppearance

export const InlineButton = {
  url: (text: string, url: string, options?: ButtonAppearance): InlineButton =>
    ({ text, url, ...options }),

  callback: (text: string, callbackData: string, options?: ButtonAppearance): InlineButton =>
    ({ text, callbackData, ...options }),

  webApp: (text: string, url: string, options?: ButtonAppearance): InlineButton =>
    ({ text, webApp: { url }, ...options }),

  loginUrl: (text: string, loginUrl: LoginUrl, options?: ButtonAppearance): InlineButton =>
    ({ text, loginUrl, ...options }),

  switchInline: (text: string, query?: string, options?: ButtonAppearance): InlineButton =>
    ({ text, switchInlineQuery: query ?? '', ...options }),

  switchInlineCurrentChat: (text: string, query?: string, options?: ButtonAppearance): InlineButton =>
    ({ text, switchInlineQueryCurrentChat: query ?? '', ...options }),

  switchInlineChosenChat: (text: string, chosenChat?: SwitchInlineQueryChosenChat, options?: ButtonAppearance): InlineButton =>
    ({ text, switchInlineQueryChosenChat: chosenChat ?? {}, ...options }),

  copyText: (text: string, copyText: string, options?: ButtonAppearance): InlineButton =>
    ({ text, copyText, ...options }),

  callbackGame: (text: string, options?: ButtonAppearance): InlineButton =>
    ({ text, callbackGame: {}, ...options }),

  pay: (text: string): InlineButton =>
    ({ text, pay: true as const }),
}

// =============================================================================
// Reply button
// =============================================================================

/**
 * Button of a custom reply keyboard.
 *
 * - For simple text buttons, the string can be used instead of an object.
 * - At most one action field may be specified per button.
 */
export type ReplyButton =
  | string
  | { readonly text: string } & ButtonAppearance
  | { readonly text: string, readonly requestUsers: RequestUsers } & ButtonAppearance
  | { readonly text: string, readonly requestChat: RequestChat } & ButtonAppearance
  | { readonly text: string, readonly requestContact: true } & ButtonAppearance
  | { readonly text: string, readonly requestLocation: true } & ButtonAppearance
  | { readonly text: string, readonly requestPoll: true | 'quiz' | 'regular' } & ButtonAppearance
  | { readonly text: string, readonly webApp: WebAppInfo } & ButtonAppearance

export const ReplyButton = {
  text: (text: string, options?: ButtonAppearance): ReplyButton => ({ text, ...options }),

  requestUsers: (text: string, requestUsers: RequestUsers, options?: ButtonAppearance): ReplyButton =>
    ({ text, requestUsers, ...options }),

  requestChat: (text: string, requestChat: RequestChat, options?: ButtonAppearance): ReplyButton =>
    ({ text, requestChat, ...options }),

  requestContact: (text: string, options?: ButtonAppearance): ReplyButton =>
    ({ text, requestContact: true, ...options }),

  requestLocation: (text: string, options?: ButtonAppearance): ReplyButton =>
    ({ text, requestLocation: true, ...options }),

  requestPoll: (text: string, type?: 'quiz' | 'regular', options?: ButtonAppearance): ReplyButton =>
    ({ text, requestPoll: type ?? true, ...options }),

  webApp: (text: string, url: string, options?: ButtonAppearance): ReplyButton =>
    ({ text, webApp: { url }, ...options }),
}

// =============================================================================
// Miscellaneous
// =============================================================================

/**
 * Button style for inline and reply keyboards.
 */
export type ButtonStyle = 'danger' | 'success' | 'primary'

/**
 * Appearance options for inline and reply keyboard buttons.
 */
export interface ButtonAppearance {
  readonly style?: ButtonStyle
  readonly iconEmojiId?: string
}

/**
 * Information about a Web App (a.k.a. Mini App).
 */
export interface WebAppInfo {
  readonly url: string
}

/**
 * Login URL for inline keyboard buttons.
 */
export interface LoginUrl {
  readonly url: string
  readonly forwardText?: string
  readonly botUsername?: string
  readonly requestWriteAccess?: boolean
}

/**
 * Switch inline query chosen chat options.
 */
export interface SwitchInlineQueryChosenChat {
  readonly query?: string
  readonly allowUserChats?: boolean
  readonly allowBotChats?: boolean
  readonly allowGroupChats?: boolean
  readonly allowChannelChats?: boolean
}

/**
 * Placeholder for a game button. Use [BotFather](https://t.me/botfather) to set up your game.
 */
export interface CallbackGame {}

/**
 * Criteria for requesting suitable users. Used with request_users.
 */
export interface RequestUsers {
  readonly requestId: number
  readonly userIsBot?: boolean
  readonly userIsPremium?: boolean
  readonly maxQuantity?: number
  readonly requestName?: boolean
  readonly requestUsername?: boolean
  readonly requestPhoto?: boolean
}

/**
 * Rights of an administrator in a chat.
 */
export interface ChatAdminRights {
  readonly isAnonymous: boolean
  readonly canManageChat: boolean
  readonly canDeleteMessages: boolean
  readonly canManageVideoChats: boolean
  readonly canRestrictMembers: boolean
  readonly canPromoteMembers: boolean
  readonly canChangeInfo: boolean
  readonly canInviteUsers: boolean
  readonly canPostStories: boolean
  readonly canEditStories: boolean
  readonly canDeleteStories: boolean
  readonly canPostMessages?: boolean
  readonly canEditMessages?: boolean
  readonly canPinMessages?: boolean
  readonly canManageTopics?: boolean
  readonly canManageDirectMessages?: boolean
}

/**
 * Criteria for requesting a suitable chat. Used with request_chat.
 */
export interface RequestChat {
  readonly requestId: number
  readonly chatIsChannel: boolean
  readonly chatIsForum?: boolean
  readonly chatHasUsername?: boolean
  readonly chatIsCreated?: boolean
  readonly userAdministratorRights?: ChatAdminRights
  readonly botAdministratorRights?: ChatAdminRights
  readonly botIsMember?: boolean
  readonly requestTitle?: boolean
  readonly requestUsername?: boolean
  readonly requestPhoto?: boolean
}
