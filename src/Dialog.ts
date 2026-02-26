import type * as BotApi from './BotApi.ts'
import * as Brand from 'effect/Brand'
import * as Data from 'effect/Data'
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

const _PrivateTopic: ReturnType<typeof Data.TaggedClass<'PrivateTopic'>> = Data.TaggedClass('PrivateTopic')
export class PrivateTopic extends _PrivateTopic<{
  user: User
  topicId: number
}> {}

const _ForumTopic: ReturnType<typeof Data.TaggedClass<'ForumTopic'>> = Data.TaggedClass('ForumTopic')
export class ForumTopic extends _ForumTopic<{
  supergroup: Supergroup
  topicId: number
}> {}

const _ChannelDm: ReturnType<typeof Data.TaggedClass<'ChannelDm'>> = Data.TaggedClass('ChannelDm')
export class ChannelDm extends _ChannelDm<{
  channel: Channel
  topicId: number
}> {}

// =============================================================================
// Peer
// =============================================================================

export type Peer =
  | User
  | Group
  | Channel
  | Supergroup

const _User: ReturnType<typeof Data.TaggedClass<'User'>> = Data.TaggedClass('User')
export class User extends _User<{
  id: UserId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('user', this.id))
  }

  public topic(topicId: number): PrivateTopic {
    return new PrivateTopic({ user: this, topicId })
  }
}

const _Group: ReturnType<typeof Data.TaggedClass<'Group'>> = Data.TaggedClass('Group')
export class Group extends _Group<{
  id: GroupId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('group', this.id))
  }
}

const _Channel: ReturnType<typeof Data.TaggedClass<'Channel'>> = Data.TaggedClass('Channel')
export class Channel extends _Channel<{
  id: ChannelId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('channel', this.id))
  }

  public directMessages(topicId: number): ChannelDm {
    return new ChannelDm({ channel: this, topicId })
  }
}

const _Supergroup: ReturnType<typeof Data.TaggedClass<'Supergroup'>> = Data.TaggedClass('Supergroup')
export class Supergroup extends _Supergroup<{
  id: SupergroupId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('channel', this.id))
  }

  public topic(topicId: number): ForumTopic {
    return new ForumTopic({ supergroup: this, topicId })
  }
}

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

/**
 * ID for channels (including supergroups).
 *
 * @see {@link https://core.telegram.org/api/bots/ids Telegram API • Bot API dialog IDs}
 */
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

export const user: (id: number) => User = (id) => {
  return new User({ id: UserId(id) })
}

export const group: (id: number) => Group = (id) => {
  return new Group({ id: GroupId(id) })
}

export const channel: (id: number) => Channel = (id) => {
  return new Channel({ id: ChannelId(id) })
}

export const supergroup: (id: number) => Supergroup = (id) => {
  return new Supergroup({ id: ChannelId(id) })
}

export const ofMessage: (
  message: BotApi.Types.Message,
) => Dialog = internal.ofMessage
