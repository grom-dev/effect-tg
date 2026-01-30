import { describe, expect, it } from 'vitest'
import * as Option from 'effect/Option'
import * as Content from '../src/Content.ts'
import * as Text from '../src/Text.ts'

describe('Content.text', () => {
  it('stores text and defaults linkPreview to none', () => {
    const text = Text.plain('hello')
    const message = Content.text(text)

    expect(message.text).toBe(text)
    expect(Option.isNone(message.linkPreview)).toBe(true)
  })
})
