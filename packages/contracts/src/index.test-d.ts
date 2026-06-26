import { expectTypeOf, test } from "vitest"
import { i128ToScVal, parseSorobanError } from "."

test("public SDK exports retain their callable types", () => {
  expectTypeOf(parseSorobanError).parameter(0).toEqualTypeOf<unknown>()
  expectTypeOf(parseSorobanError).returns.toEqualTypeOf<string>()
  expectTypeOf(i128ToScVal).parameter(0).toEqualTypeOf<bigint>()
})
