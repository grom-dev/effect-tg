import type * as BotApi from './BotApi.ts'
import * as Effect from 'effect/Effect'
import * as Option from 'effect/Option'
import * as Bot from './Bot.ts'

export const when = <
  TShapes extends Shapes,
  TRet = void,
>(
  ...shapes: When<TShapes, TRet>
): When<TShapes, TRet> => shapes

export const selectWhen = <
  TOut,
  TShapes extends Shapes,
  TErr = never,
  TReq = never,
>(
  ...shapes: WhenSelector<TOut, TShapes, TErr, TReq>
): WhenSelector<TOut, TShapes, TErr, TReq> => shapes

export const match = <TPatterns extends Patterns>(
  ...patterns: TPatterns
): Effect.Effect<
  Option.Option<PatternsOut<TPatterns>>,
  PatternsErr<TPatterns>,
  PatternsReq<TPatterns> | Bot.Update
> => {
  return Effect.gen(function* () {
    const update = yield* Bot.Update
    for (const pattern of patterns) {
      if (pattern.length < 2) {
        throw new Error('Each pattern must have at least two elements: shape and handler function.')
      }
      const shapes = pattern.slice(0, pattern.length - 1)
      const fn = pattern.at(-1) as Handler<any, any>
      for (const shape of shapes) {
        const selectors = Array.from(Object.entries(shape)) as Array<[string, Selector<any, any, any, any>]>
        const selected: Array<[string, any]> = []
        for (const [key, selector] of selectors) {
          if (Array.isArray(selector)) {
            throw new TypeError('TODO: WhenSelector is not supported yet')
          }
          else if (Effect.isEffect(selector)) {
            const option = yield* selector
            if (Option.isNone(option)) {
              break
            }
            selected.push([key, option.value])
          }
          else if (typeof selector === 'function') {
            const option = selector(update)
            if (Option.isNone(option)) {
              break
            }
            selected.push([key, option.value])
          }
          else {
            throw new TypeError(`Invalid selector with key "${key}": ${selector}`)
          }
        }
        if (selectors.length === selected.length) {
          return Option.some(fn(Object.fromEntries(selected)))
        }
      }
    }
    return Option.none()
  })
}

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

type Update = BotApi.Types.Update

export type Selector<TOut, TShapes extends Shapes = [], TErr = never, TReq = never>
  = | MatchUpdateSelector<TOut>
    | EffectSelector<TOut, TErr, TReq>
    | WhenSelector<TOut, TShapes, TErr, TReq>

export type MatchUpdateSelector<TOut> = ((update: Update) => Option.Option<TOut>)

export type EffectSelector<TOut, TErr, TReq> = Effect.Effect<
  Option.Option<TOut>,
  TErr,
  TReq
>

export type WhenSelector<
  TOut,
  TShapes extends Shapes,
  TErr = never,
  TReq = never,
> = [...shapes: TShapes, fn: Handler<TShapes, EffectSelector<TOut, TErr, TReq>>]

export type SelectorOut<TSelector extends Selector<any, any, any, any>>
  = TSelector extends MatchUpdateSelector<infer TOut>
    ? TOut
    : TSelector extends EffectSelector<infer TOut, any, any>
      ? TOut
      : TSelector extends WhenSelector<infer TOut, any, any, any>
        ? TOut
        : never

export type SelectorErr<TSelector extends Selector<any, any, any, any>>
  = TSelector extends MatchUpdateSelector<any>
    ? never
    : TSelector extends EffectSelector<any, infer TErr, any>
      ? TErr
      : TSelector extends WhenSelector<any, any, infer TErr, any>
        ? TErr
        : never

export type SelectorReq<TSelector extends Selector<any, any, any, any>>
  = TSelector extends MatchUpdateSelector<any>
    ? never
    : TSelector extends EffectSelector<any, any, infer TReq>
      ? TReq
      : TSelector extends WhenSelector<any, any, any, infer TReq>
        ? TReq
        : never

export type Shapes = ReadonlyArray<Record<string, Selector<any, any, any, any>>>

export type Handler<
  TShapes extends Shapes,
  TRet = void,
> = (selected: {
  [I in keyof TShapes]: {
    [K in keyof TShapes[I]]: SelectorOut<TShapes[I][K]>
  }
}[number]) => TRet

export type When<
  TShapes extends Shapes,
  TRet = void,
> = [...shapes: TShapes, fn: Handler<TShapes, TRet>]

export type Patterns = ReadonlyArray<When<any, any>>

export type PatternsOut<TPatterns extends Patterns> = {
  [I in keyof TPatterns]: TPatterns[I] extends When<any, infer TOut> ? TOut : never
}[number]

export type PatternsErr<TPatterns extends Patterns> = {
  [I in keyof TPatterns]: TPatterns[I] extends When<infer Shapes, any>
    ? {
        [ShapeI in keyof Shapes]: {
          [ShapeItemK in keyof Shapes[ShapeI]]: SelectorErr<Shapes[ShapeI][ShapeItemK]>
        }[keyof Shapes[ShapeI]]
      }[number]
    : unknown
}[number]

export type PatternsReq<TPatterns extends Patterns> = {
  [I in keyof TPatterns]: TPatterns[I] extends When<infer Shapes, any>
    ? {
        [ShapeI in keyof Shapes]: {
          [ShapeItemK in keyof Shapes[ShapeI]]: SelectorReq<Shapes[ShapeI][ShapeItemK]>
        }[keyof Shapes[ShapeI]]
      }[number]
    : unknown
}[number]
