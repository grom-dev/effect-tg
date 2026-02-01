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

export class PrivateTopic extends Data.TaggedClass('PrivateTopic')<{
  user: User
  topicId: number
}> {}

export class ForumTopic extends Data.TaggedClass('ForumTopic')<{
  supergroup: Supergroup
  topicId: number
}> {}

export class ChannelDm extends Data.TaggedClass('ChannelDm')<{
  channel: Channel
  topicId: number
}> {}

// =============================================================================
// Peer
// =============================================================================

export type Peer =
  | User
  | Group
  | Supergroup
  | Channel

export class User extends Data.TaggedClass('User')<{
  id: UserId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('user', this.id))
  }

  public topic(topicId: number): PrivateTopic {
    return new PrivateTopic({ user: this, topicId })
  }
}

export class Group extends Data.TaggedClass('Group')<{
  id: GroupId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('group', this.id))
  }
}

export class Supergroup extends Data.TaggedClass('Supergroup')<{
  id: SupergroupId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('supergroup', this.id))
  }

  public topic(topicId: number): ForumTopic {
    return new ForumTopic({ supergroup: this, topicId })
  }
}

export class Channel extends Data.TaggedClass('Channel')<{
  id: ChannelId
}> {
  public dialogId(): DialogId {
    return Option.getOrThrow(internal.encodePeerId('supergroup', this.id))
  }

  public directMessages(topicId: number): ChannelDm {
    return new ChannelDm({ channel: this, topicId })
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
export const DialogId = Brand.refined<DialogId>(
  n => Option.isSome(internal.decodeDialogId(n)),
  n => Brand.error(`Invalid dialog ID: ${n}`),
)

export type UserId = number & Brand.Brand<'@grom.js/effect-tg/UserId'>
export const UserId = Brand.refined<UserId>(
  n => Option.isSome(internal.encodePeerId('user', n)),
  n => Brand.error(`Invalid user ID: ${n}`),
)

export type GroupId = number & Brand.Brand<'@grom.js/effect-tg/GroupId'>
export const GroupId = Brand.refined<GroupId>(
  n => Option.isSome(internal.encodePeerId('group', n)),
  n => Brand.error(`Invalid group ID: ${n}`),
)

export type SupergroupId = number & Brand.Brand<'@grom.js/effect-tg/SupergroupId'>
export const SupergroupId = Brand.refined<SupergroupId>(
  n => Option.isSome(internal.encodePeerId('supergroup', n)),
  n => Brand.error(`Invalid supergroup or channel ID: ${n}`),
)

export type ChannelId = SupergroupId
export const ChannelId = SupergroupId

// =============================================================================
// Dialog ID <-> Peer ID
// =============================================================================

export const decodeDialogId: (dialogId: number) => Option.Option<
  | { peer: 'user', id: UserId }
  | { peer: 'group', id: GroupId }
  | { peer: 'supergroup', id: SupergroupId }
  | { peer: 'monoforum', id: number }
  | { peer: 'secret-chat', id: number }
> = internal.decodeDialogId

export const decodePeerId: {
  (peer: 'user', dialogId: number): Option.Option<UserId>
  (peer: 'group', dialogId: number): Option.Option<GroupId>
  (peer: 'supergroup', dialogId: number): Option.Option<SupergroupId>
  (peer: 'monoforum', dialogId: number): Option.Option<number>
  (peer: 'secret-chat', dialogId: number): Option.Option<number>
} = internal.decodePeerId

export const encodePeerId: (
  peer: 'user' | 'group' | 'supergroup' | 'monoforum' | 'secret-chat',
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

export const supergroup: (id: number) => Supergroup = (id) => {
  return new Supergroup({ id: SupergroupId(id) })
}

export const channel: (id: number) => Channel = (id) => {
  return new Channel({ id: SupergroupId(id) })
}

export const ofMessage: (
  message: BotApi.Types.Message,
) => Dialog = internal.ofMessage
