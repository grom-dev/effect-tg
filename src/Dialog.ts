import type * as BotApi from './BotApi.ts'
import * as Brand from 'effect/Brand'
import * as Match from 'effect/Match'
import * as Option from 'effect/Option'
import * as internal from './internal/dialog.ts'

// =============================================================================
// Dialog
// =============================================================================

export type Dialog =
  | Peer
  | PrivateTopic
  | ForumTopic
  | ChannelDm

export interface PrivateTopic {
  readonly _tag: 'PrivateTopic'
  readonly user: User
  readonly topicId: number
}

export interface ForumTopic {
  readonly _tag: 'ForumTopic'
  readonly supergroup: Supergroup
  readonly topicId: number
}

export interface ChannelDm {
  readonly _tag: 'ChannelDm'
  readonly channel: Channel
  readonly topicId: number
}

// =============================================================================
// Peer
// =============================================================================

export type Peer =
  | User
  | Group
  | Channel
  | Supergroup

export interface User {
  readonly _tag: 'User'
  readonly id: UserId
}

export interface Group {
  readonly _tag: 'Group'
  readonly id: GroupId
}

export interface Channel {
  readonly _tag: 'Channel'
  readonly id: ChannelId
}

export interface Supergroup {
  readonly _tag: 'Supergroup'
  readonly id: SupergroupId
}

// =============================================================================
// Peer Functions
// =============================================================================

export const dialogId: (peer: Peer) => DialogId = Match.type<Peer>().pipe(
  Match.tagsExhaustive({
    User: u => Option.getOrThrow(internal.encodePeerId('user', u.id)),
    Group: g => Option.getOrThrow(internal.encodePeerId('group', g.id)),
    Channel: c => Option.getOrThrow(internal.encodePeerId('channel', c.id)),
    Supergroup: s => Option.getOrThrow(internal.encodePeerId('channel', s.id)),
  }),
)

// =============================================================================
// Brands
// =============================================================================

/**
 * Dialog ID is a single integer encoding peer type and its ID.
 *
 * @see {@link https://core.telegram.org/api/bots/ids Telegram API • Bot API dialog IDs}
 */
export type DialogId = number & Brand.Brand<'@grom.js/effect-tg/DialogId'>
export const DialogId: Brand.Brand.Constructor<DialogId> = Brand.refined<DialogId>(
  n => Option.isSome(internal.decodeDialogId(n)),
  n => Brand.error(`Invalid dialog ID: ${n}`),
)

export type UserId = number & Brand.Brand<'@grom.js/effect-tg/UserId'>
export const UserId: Brand.Brand.Constructor<UserId> = Brand.refined<UserId>(
  n => Option.isSome(internal.encodePeerId('user', n)),
  n => Brand.error(`Invalid user ID: ${n}`),
)

export type GroupId = number & Brand.Brand<'@grom.js/effect-tg/GroupId'>
export const GroupId: Brand.Brand.Constructor<GroupId> = Brand.refined<GroupId>(
  n => Option.isSome(internal.encodePeerId('group', n)),
  n => Brand.error(`Invalid group ID: ${n}`),
)

export type ChannelId = number & Brand.Brand<'@grom.js/effect-tg/ChannelId'>
export const ChannelId: Brand.Brand.Constructor<ChannelId> = Brand.refined<ChannelId>(
  n => Option.isSome(internal.encodePeerId('channel', n)),
  n => Brand.error(`Invalid channel or supergroup ID: ${n}`),
)

/** @alias ChannelId */
export type SupergroupId = ChannelId

/** @alias ChannelId */
export const SupergroupId: Brand.Brand.Constructor<ChannelId> = ChannelId

// =============================================================================
// Dialog ID <-> Peer ID
// =============================================================================

export const decodeDialogId: (dialogId: number) => Option.Option<
  | { peer: 'user', id: UserId }
  | { peer: 'group', id: GroupId }
  | { peer: 'channel', id: ChannelId }
  | { peer: 'monoforum', id: number }
  | { peer: 'secret-chat', id: number }
> = internal.decodeDialogId

export const decodePeerId: {
  (peer: 'user', dialogId: number): Option.Option<UserId>
  (peer: 'group', dialogId: number): Option.Option<GroupId>
  (peer: 'channel', dialogId: number): Option.Option<ChannelId>
  (peer: 'monoforum', dialogId: number): Option.Option<number>
  (peer: 'secret-chat', dialogId: number): Option.Option<number>
} = internal.decodePeerId

export const encodePeerId: (
  peer: 'user' | 'group' | 'channel' | 'monoforum' | 'secret-chat',
  id: number,
) => Option.Option<DialogId> = internal.encodePeerId

// =============================================================================
// Constructors
// =============================================================================

export const user: (id: number) => User = id => ({ _tag: 'User', id: UserId(id) })

export const group: (id: number) => Group = id => ({ _tag: 'Group', id: GroupId(id) })

export const channel: (id: number) => Channel = id => ({ _tag: 'Channel', id: ChannelId(id) })

export const supergroup: (id: number) => Supergroup = id => ({ _tag: 'Supergroup', id: ChannelId(id) })

export const privateTopic: (
  user: User,
  topicId: number,
) => PrivateTopic = (user, topicId) => ({
  _tag: 'PrivateTopic',
  user,
  topicId,
})

export const forumTopic: (
  supergroup: Supergroup,
  topicId: number,
) => ForumTopic = (supergroup, topicId) => ({
  _tag: 'ForumTopic',
  supergroup,
  topicId,
})

export const channelDm: (
  channel: Channel,
  topicId: number,
) => ChannelDm = (channel, topicId) => ({
  _tag: 'ChannelDm',
  channel,
  topicId,
})

export const ofMessage: (
  message: BotApi.Types.Message,
) => Dialog = internal.ofMessage
