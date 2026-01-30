import { expectTypeOf, it } from 'vitest'

it('true extends boolean', () => {
  expectTypeOf(true as const).toExtend<boolean>()
})
