import * as Option from 'effect/Option'
import { describe, expect, it } from 'vitest'
import { Dialog } from '../src/index.ts'

describe('Dialog', () => {
  describe('decodeDialogId', () => {
    it('should decode IDs at the range edges correctly', () => {
      expect(Option.getOrThrow(Dialog.decodeDialogId(-4000000000000))).toEqual({ peer: 'monoforum', id: 3000000000000 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-2002147483649))).toEqual({ peer: 'monoforum', id: 1002147483649 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-2002147483648))).toEqual({ peer: 'secret-chat', id: -2147483648 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-1997852516353))).toEqual({ peer: 'secret-chat', id: 2147483647 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-1997852516352))).toEqual({ peer: 'supergroup', id: 997852516352 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-1000000000001))).toEqual({ peer: 'supergroup', id: 1 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-999999999999))).toEqual({ peer: 'group', id: 999999999999 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-1))).toEqual({ peer: 'group', id: 1 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(1))).toEqual({ peer: 'user', id: 1 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(0xFFFFFFFFFF))).toEqual({ peer: 'user', id: 1099511627775 })
    })

    it('should decode valid IDs correctly', () => {
      expect(Option.getOrThrow(Dialog.decodeDialogId(500000000000))).toEqual({ peer: 'user', id: 500000000000 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-500000000000))).toEqual({ peer: 'group', id: 500000000000 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-1500000000000))).toEqual({ peer: 'supergroup', id: 500000000000 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-3500000000000))).toEqual({ peer: 'monoforum', id: 2500000000000 })
      expect(Option.getOrThrow(Dialog.decodeDialogId(-2000000000000))).toEqual({ peer: 'secret-chat', id: 0 })
    })

    it('should return None for holes', () => {
      expect(Option.isNone(Dialog.decodeDialogId(0))).toBe(true)
      expect(Option.isNone(Dialog.decodeDialogId(-1000000000000))).toBe(true)
    })

    it('should return None for non-safe integers', () => {
      expect(Option.isNone(Dialog.decodeDialogId(Number.MAX_SAFE_INTEGER + 1))).toBe(true)
      expect(Option.isNone(Dialog.decodeDialogId(Number.MIN_SAFE_INTEGER - 1))).toBe(true)
      expect(Option.isNone(Dialog.decodeDialogId(Infinity))).toBe(true)
      expect(Option.isNone(Dialog.decodeDialogId(-Infinity))).toBe(true)
      expect(Option.isNone(Dialog.decodeDialogId(Number.NaN))).toBe(true)
      expect(Option.isNone(Dialog.decodeDialogId(10.2))).toBe(true)
    })
  })

  describe('decodePeerId', () => {
    it('should decode IDs at the range edges correctly', () => {
      expect(Option.getOrThrow(Dialog.decodePeerId('monoforum', -4000000000000))).toBe(3000000000000)
      expect(Option.getOrThrow(Dialog.decodePeerId('monoforum', -2002147483649))).toBe(1002147483649)
      expect(Option.getOrThrow(Dialog.decodePeerId('secret-chat', -2002147483648))).toBe(-2147483648)
      expect(Option.getOrThrow(Dialog.decodePeerId('secret-chat', -1997852516353))).toBe(2147483647)
      expect(Option.getOrThrow(Dialog.decodePeerId('supergroup', -1997852516352))).toBe(997852516352)
      expect(Option.getOrThrow(Dialog.decodePeerId('supergroup', -1000000000001))).toBe(1)
      expect(Option.getOrThrow(Dialog.decodePeerId('group', -999999999999))).toBe(999999999999)
      expect(Option.getOrThrow(Dialog.decodePeerId('group', -1))).toBe(1)
      expect(Option.getOrThrow(Dialog.decodePeerId('user', 1))).toBe(1)
      expect(Option.getOrThrow(Dialog.decodePeerId('user', 1099511627775))).toBe(0xFFFFFFFFFF)
    })

    it('should decode valid IDs correctly', () => {
      expect(Option.getOrThrow(Dialog.decodePeerId('monoforum', -3500000000000))).toBe(2500000000000)
      expect(Option.getOrThrow(Dialog.decodePeerId('secret-chat', -2000000000000))).toBe(0)
      expect(Option.getOrThrow(Dialog.decodePeerId('supergroup', -1500000000000))).toBe(500000000000)
      expect(Option.getOrThrow(Dialog.decodePeerId('group', -500000000000))).toBe(500000000000)
      expect(Option.getOrThrow(Dialog.decodePeerId('user', 500000000000))).toBe(500000000000)
    })

    it('should return None for mismatched peer type', () => {
      expect(Option.isNone(Dialog.decodePeerId('user', -1))).toBe(true)
      expect(Option.isNone(Dialog.decodePeerId('group', 1))).toBe(true)
      expect(Option.isNone(Dialog.decodePeerId('supergroup', -1))).toBe(true)
      expect(Option.isNone(Dialog.decodePeerId('monoforum', -1))).toBe(true)
      expect(Option.isNone(Dialog.decodePeerId('secret-chat', -1))).toBe(true)
    })
  })

  describe('encodePeerId', () => {
    it('should encode IDs at range edges correctly', () => {
      expect(Option.getOrThrow(Dialog.encodePeerId('user', 1))).toBe(1)
      expect(Option.getOrThrow(Dialog.encodePeerId('user', 0xFFFFFFFFFF))).toBe(1099511627775)
      expect(Option.getOrThrow(Dialog.encodePeerId('group', 1))).toBe(-1)
      expect(Option.getOrThrow(Dialog.encodePeerId('group', 999999999999))).toBe(-999999999999)
      expect(Option.getOrThrow(Dialog.encodePeerId('supergroup', 1))).toBe(-1000000000001)
      expect(Option.getOrThrow(Dialog.encodePeerId('supergroup', 997852516352))).toBe(-1997852516352)
      expect(Option.getOrThrow(Dialog.encodePeerId('monoforum', 1002147483649))).toBe(-2002147483649)
      expect(Option.getOrThrow(Dialog.encodePeerId('monoforum', 3000000000000))).toBe(-4000000000000)
      expect(Option.getOrThrow(Dialog.encodePeerId('secret-chat', -2147483648))).toBe(-2002147483648)
      expect(Option.getOrThrow(Dialog.encodePeerId('secret-chat', 2147483647))).toBe(-1997852516353)
    })

    it('should encode valid IDs correctly', () => {
      expect(Option.getOrThrow(Dialog.encodePeerId('user', 500000000000))).toBe(500000000000)
      expect(Option.getOrThrow(Dialog.encodePeerId('group', 500000000000))).toBe(-500000000000)
      expect(Option.getOrThrow(Dialog.encodePeerId('supergroup', 500000000000))).toBe(-1500000000000)
      expect(Option.getOrThrow(Dialog.encodePeerId('monoforum', 2500000000000))).toBe(-3500000000000)
      expect(Option.getOrThrow(Dialog.encodePeerId('secret-chat', 0))).toBe(-2000000000000)
    })

    it('should return None for IDs outside valid range', () => {
      expect(Option.isNone(Dialog.encodePeerId('user', 0))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('user', 1099511627776))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('group', 0))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('group', 1000000000000))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('supergroup', 0))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('supergroup', 997852516353))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('monoforum', 1002147483648))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('monoforum', 3000000000001))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('secret-chat', -2147483649))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('secret-chat', 2147483648))).toBe(true)
    })

    it('should return None for non-safe integers', () => {
      expect(Option.isNone(Dialog.encodePeerId('user', Number.MAX_SAFE_INTEGER + 1))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('user', Infinity))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('user', Number.NaN))).toBe(true)
      expect(Option.isNone(Dialog.encodePeerId('user', 123.456))).toBe(true)
    })

    it.each([
      ['user', 9091348234],
      ['group', 43138491],
      ['supergroup', 12729042939],
      ['monoforum', 2987658076159],
      ['secret-chat', 2140000000],
    ] as const)('should roundtrip %s ID', (peer, peerId) => {
      const encoded = Option.getOrThrow(Dialog.encodePeerId(peer, peerId))
      const decoded = Option.getOrThrow(Dialog.decodePeerId(peer as any, encoded))
      expect(decoded).toBe(peerId)
    })
  })
})
