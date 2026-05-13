import type * as HttpBody from 'effect/unstable/http/HttpBody'
import type * as HttpClientError from 'effect/unstable/http/HttpClientError'
import type * as BotApiTransport from './BotApiTransport.ts'
import * as Data from 'effect/Data'
import * as Duration from 'effect/Duration'
import * as Option from 'effect/Option'
import * as Predicate from 'effect/Predicate'
import * as Dialog from './Dialog.ts'
import * as internal from './internal/botApiError.ts'

export const TypeId: unique symbol = Symbol.for('@grom.js/effect-tg/BotApiError')

export type TypeId = typeof TypeId

export const isBotApiError = (u: unknown): u is BotApiError => Predicate.hasProperty(u, TypeId)

export type BotApiError =
  | TransportError
  | MethodFailed
  | GroupUpgraded
  | RateLimited
  | InternalServerError

/**
 * Error caused by the transport when accessing Bot API.
 */
export class TransportError extends Data.TaggedError('TransportError')<{
  readonly cause:
    | HttpClientError.HttpClientError
    | HttpBody.HttpBodyError
}> {
  readonly [TypeId]: typeof TypeId = TypeId
  override get message(): string {
    return this.cause.message
  }
}

export class MethodFailed extends Data.TaggedError('MethodFailed')<{
  readonly response: FailureResponse
  readonly possibleReason: MethodFailureReason
}> {
  readonly [TypeId]: typeof TypeId = TypeId
  override get message() {
    return `(${this.response.error_code}) ${this.response.description}`
  }
}

export class GroupUpgraded extends Data.TaggedError('GroupUpgraded')<{
  readonly response: FailureResponse
  readonly supergroup: Dialog.Supergroup
}> {
  readonly [TypeId]: typeof TypeId = TypeId
  override get message() {
    return `Group has been upgraded to a supergroup with ID ${this.supergroup.id}.`
  }
}

export class RateLimited extends Data.TaggedError('RateLimited')<{
  readonly response: FailureResponse
  readonly retryAfter: Duration.Duration
}> {
  readonly [TypeId]: typeof TypeId = TypeId
  override get message() {
    return `Flood limit exceeded. Should wait for ${Duration.format(this.retryAfter)} before retrying.`
  }
}

export class InternalServerError extends Data.TaggedError('InternalServerError')<{
  readonly response: FailureResponse
}> {
  readonly [TypeId]: typeof TypeId = TypeId
  override get message() {
    return `Internal error (${this.response.error_code}): ${this.response.description}`
  }
}

export const fromResponse = (response: FailureResponse): BotApiError => {
  if (response.error_code === 429 && response.parameters?.retry_after != null) {
    return new RateLimited({
      response,
      retryAfter: Duration.seconds(response.parameters.retry_after),
    })
  }
  if (response.error_code === 400 && response.parameters?.migrate_to_chat_id != null) {
    return new GroupUpgraded({
      response,
      supergroup: Dialog.supergroup(
        Option.getOrThrow(
          Dialog.decodePeerId('channel', response.parameters.migrate_to_chat_id),
        ),
      ),
    })
  }
  if (response.error_code >= 500) {
    return new InternalServerError({ response })
  }
  return new MethodFailed({
    response,
    possibleReason: internal.guessReason({
      code: response.error_code,
      description: response.description,
    }),
  })
}

export type MethodFailureReason =
  | 'Unknown'
  | 'BotBlockedByUser'
  | 'MessageNotModified'
  | 'ReplyMarkupTooLong'
  | 'QueryIdInvalid'
  | 'MediaGroupedInvalid'

type FailureResponse = Extract<BotApiTransport.BotApiResponse, { ok: false }>
