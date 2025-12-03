import type * as BotApi from './BotApi.ts'
import { Data } from 'effect'
import * as Effect from 'effect/Effect'
import * as Option from 'effect/Option'

export interface Router<A, E, R> {
  readonly route: {
    (update: BotApi.Types.Update): Effect.Effect<A, E | RouteNotFound, R>
  }
}

export class RouteNotFound extends Data.TaggedError('@grom.js/effect-tg/Router/RouteNotFound') {}

export interface Route<TOut, _TErr, _TReq> {
  readonly _shapes: Shapes
  readonly _handler: Handler<any, TOut>
}

export const when = <
  TShapes extends Shapes,
  TRet = void,
>(
  ...shapes: When<TShapes, TRet>
): Route<
  WhenOut<When<TShapes, TRet>>,
  WhenErr<When<TShapes, TRet>>,
  WhenReq<When<TShapes, TRet>>
> => ({
  _shapes: shapes.slice(0, shapes.length - 1),
  _handler: shapes[shapes.length - 1],
} as any)

export const selectWhen = <
  TOut,
  TShapes extends Shapes,
  TErr = never,
  TReq = never,
>(
  ...shapes: WhenSelector<TOut, TErr, TReq, TShapes>
): WhenSelector<TOut, TErr, TReq, TShapes> => shapes

export const make = <TRoutes extends Routes>(...routes: TRoutes): Router<
  RoutesOut<TRoutes>,
  RoutesErr<TRoutes>,
  RoutesReq<TRoutes>
> => {
  return {
    route: update => Effect.gen(function* () {
      for (const { _shapes: shapes, _handler: handler } of routes) {
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
            return handler(Object.fromEntries(selected))
          }
        }
      }
      return yield* Effect.fail(new RouteNotFound())
    }),
  }
}

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

export type Selector<TOut, TErr = never, TReq = never, TShapes extends Shapes = []>
  = | MatchUpdateSelector<TOut>
    | EffectSelector<TOut, TErr, TReq>
    | WhenSelector<TOut, TErr, TReq, TShapes>

export interface MatchUpdateSelector<TOut> {
  (update: BotApi.Types.Update): Option.Option<TOut>
}

export type EffectSelector<TOut, TErr, TReq> = Effect.Effect<
  Option.Option<TOut>,
  TErr,
  TReq
>

export type WhenSelector<
  TOut,
  TErr = never,
  TReq = never,
  TShapes extends Shapes = [],
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
      : TSelector extends WhenSelector<any, infer TErr, any, any>
        ? TErr
        : never

export type SelectorReq<TSelector extends Selector<any, any, any, any>>
  = TSelector extends MatchUpdateSelector<any>
    ? never
    : TSelector extends EffectSelector<any, any, infer TReq>
      ? TReq
      : TSelector extends WhenSelector<any, any, infer TReq, any>
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

export type WhenOut<
  TWhen extends When<any, any>,
> = TWhen extends When<any, infer TOut> ? TOut : never

export type WhenErr<
  TWhen extends When<any, any>,
> = TWhen extends When<infer TShapes, any>
  ? {
      [ShapeI in keyof TShapes]: {
        [ShapeItemK in keyof TShapes[ShapeI]]: SelectorErr<TShapes[ShapeI][ShapeItemK]>
      }[keyof TShapes[ShapeI]]
    }[number]
  : unknown

export type WhenReq<
  TWhen extends When<any, any>,
> = TWhen extends When<infer TShapes, any>
  ? {
      [ShapeI in keyof TShapes]: {
        [ShapeItemK in keyof TShapes[ShapeI]]: SelectorReq<TShapes[ShapeI][ShapeItemK]>
      }[keyof TShapes[ShapeI]]
    }[number]
  : unknown

export type Routes = ReadonlyArray<Route<any, any, any>>

export type RoutesOut<TRoutes extends Routes> = {
  [I in keyof TRoutes]: TRoutes[I] extends Route<infer TOut, any, any> ? TOut : never
}[number]

export type RoutesErr<TRoutes extends Routes> = {
  [I in keyof TRoutes]: TRoutes[I] extends Route<any, infer TErr, any> ? TErr : unknown
}[number]

export type RoutesReq<TRoutes extends Routes> = {
  [I in keyof TRoutes]: TRoutes[I] extends Route<any, any, infer TReq> ? TReq : unknown
}[number]
