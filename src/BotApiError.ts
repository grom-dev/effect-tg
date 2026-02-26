import type * as HttpBody from '@effect/platform/HttpBody'
import type * as HttpClientError from '@effect/platform/HttpClientError'
import type * as BotApiTransport from './BotApiTransport.ts'
import * as Data from 'effect/Data'
import * as Duration from 'effect/Duration'
import * as Match from 'effect/Match'
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
const TransportError_base: ReturnType<typeof Data.TaggedError<'TransportError'>> = Data.TaggedError('TransportError')
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface TransportError { readonly [TypeId]: TypeId }
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export class TransportError extends TransportError_base<{
  cause:
    | HttpClientError.HttpClientError
    | HttpBody.HttpBodyError
}> {
  override get message(): string {
    return Match.value(this.cause).pipe(
      Match.tagsExhaustive({
        RequestError: e => e.message,
        ResponseError: e => e.message,
        HttpBodyError: e => Match.value(e.reason).pipe(
          Match.tagsExhaustive({
            SchemaError: e => e.error.message,
            JsonError: e => `JsonError: ${e.error}`,
          }),
        ),
      }),
    )
  }
}
Object.defineProperty(TransportError.prototype, TypeId, { value: TypeId })

const MethodFailed_base: ReturnType<typeof Data.TaggedError<'MethodFailed'>> = Data.TaggedError('MethodFailed')
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface MethodFailed { readonly [TypeId]: TypeId }
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export class MethodFailed extends MethodFailed_base<{
  response: FailureResponse
  possibleReason: MethodFailureReason
}> {
  override get message(): string {
    return `(${this.response.error_code}) ${this.response.description}`
  }
}
Object.defineProperty(MethodFailed.prototype, TypeId, { value: TypeId })

const GroupUpgraded_base: ReturnType<typeof Data.TaggedError<'GroupUpgraded'>> = Data.TaggedError('GroupUpgraded')
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface GroupUpgraded { readonly [TypeId]: TypeId }
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export class GroupUpgraded extends GroupUpgraded_base<{
  response: FailureResponse
  supergroup: Dialog.Supergroup
}> {
  override get message(): string {
    return `Group has been upgraded to a supergroup with ID ${this.supergroup.id}.`
  }
}
Object.defineProperty(GroupUpgraded.prototype, TypeId, { value: TypeId })

const RateLimited_base: ReturnType<typeof Data.TaggedError<'RateLimited'>> = Data.TaggedError('RateLimited')
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface RateLimited { readonly [TypeId]: TypeId }
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export class RateLimited extends RateLimited_base<{
  response: FailureResponse
  retryAfter: Duration.Duration
}> {
  override get message(): string {
    return `Flood limit exceeded. Should wait for ${Duration.format(this.retryAfter)} before retrying.`
  }
}
Object.defineProperty(RateLimited.prototype, TypeId, { value: TypeId })

const InternalServerError_base: ReturnType<typeof Data.TaggedError<'InternalServerError'>> = Data.TaggedError('InternalServerError')
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface InternalServerError { readonly [TypeId]: TypeId }
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export class InternalServerError extends InternalServerError_base<{
  response: FailureResponse
}> {}
Object.defineProperty(InternalServerError.prototype, TypeId, { value: TypeId })

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
