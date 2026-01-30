import { describe, expectTypeOf, it } from 'vitest'
import * as Content from '../src/Content.ts'
import * as Text from '../src/Text.ts'

describe('Content types', () => {
  it('text constructor returns Content.Text', () => {
    const value = Content.text(Text.plain('type-check'))

    expectTypeOf(value).toMatchTypeOf<Content.Text>()
  })
})
