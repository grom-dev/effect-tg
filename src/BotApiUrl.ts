import * as Context from 'effect/Context'

export interface BotApiUrl { readonly _: unique symbol }
export const BotApiUrl: Context.Tag<BotApiUrl, Service> = Context.GenericTag<BotApiUrl, Service>('@grom.js/effect-tg/BotApiUrl')

export interface Service {
  toMethod: (method: string) => URL
  toFile: (filePath: string) => URL
}

export const makeProd = (token: string): Service => (
  {
    toMethod: (method: string) => new URL(`https://api.telegram.org/bot${token}/${method}`),
    toFile: (filePath: string) => new URL(`https://api.telegram.org/file/bot${token}/${filePath}`),
  }
)

export const makeTest = (token: string): Service => (
  {
    toMethod: (method: string) => new URL(`https://api.telegram.org/bot${token}/test/${method}`),
    // TODO: make sure this works in test environment
    toFile: (filePath: string) => new URL(`https://api.telegram.org/file/bot${token}/${filePath}`),
  }
)
