import * as Context from 'effect/Context'

export interface BotApiUrl {
  readonly toMethod: (method: string) => URL
  readonly toFile: (filePath: string) => URL
}

export const BotApiUrl: Context.Tag<BotApiUrl, BotApiUrl> = Context.GenericTag<BotApiUrl>('@grom.js/effect-tg/BotApiUrl')

export const makeProd = (token: string): BotApiUrl => (
  {
    toMethod: (method: string) => new URL(`https://api.telegram.org/bot${token}/${method}`),
    toFile: (filePath: string) => new URL(`https://api.telegram.org/file/bot${token}/${filePath}`),
  }
)

export const makeTest = (token: string): BotApiUrl => (
  {
    toMethod: (method: string) => new URL(`https://api.telegram.org/bot${token}/test/${method}`),
    // TODO: make sure this works in test environment
    toFile: (filePath: string) => new URL(`https://api.telegram.org/file/bot${token}/${filePath}`),
  }
)
