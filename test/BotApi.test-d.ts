import { describe, it } from 'vitest'
import * as BotApi from '../src/BotApi.ts'

describe('BotApi', () => {
  describe('callMethod', () => {
    it('should not typecheck if no params passed for methods with required params', () => {
      // @ts-expect-error sendMessage requires parameters
      BotApi.callMethod('sendMessage')
    })
    it('should typecheck if no params passed for methods with all params optional', () => {
      BotApi.callMethod('getMe')
      BotApi.callMethod('getAvailableGifts')
      BotApi.callMethod('getUpdates')
    })
  })
})
