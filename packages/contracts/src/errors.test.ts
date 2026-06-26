import { describe, expect, it } from "vitest"
import { ORDER_EXECUTION_FROZEN_MESSAGE, parseSorobanError } from "./errors"

describe("parseSorobanError", () => {
  it("maps contract error tokens to user-facing messages", () => {
    expect(parseSorobanError({ message: "host invocation failed: ORDER_EXECUTION_FROZEN" })).toBe(
      ORDER_EXECUTION_FROZEN_MESSAGE,
    )
  })

  it("walks nested RPC error payloads", () => {
    expect(
      parseSorobanError({
        response: {
          data: '{"error":{"message":"tx_bad_seq"}}',
        },
      }),
    ).toBe("Transaction sequence is out of date. Refresh and try again.")
  })
})
