import { beforeEach, describe, expect, test } from "bun:test";
import {
  decodeAddress,
  decodeBoolean,
  decodeBytesN32,
  decodeInteger,
  decodeSorobanEvent,
  decodeTopicName,
  decodeTuple,
  dispatchEvent,
  type DecodedEvent,
} from "../src/mappings/mappingHandlers";
import { Address, Keypair, nativeToScVal, xdr } from "@stellar/stellar-sdk";

const marketToken = "CCBUUSYZJTGVA6PYUNQDFPZFHTBZ2QSHOUO7YAGRQVA46T3ZLSIYULS4";
const indexToken = "CAJ6BZKGFT47ALGMVFZZGAOXBV2RWIVYVCU4WJCQIURKRNXU346RWVAU";
const shortToken = "CBAN5YU3KRDKPTQ2H76D6S7HQFPRBGUD524F65BUM2RQCITPTRLKWKES";
const handlerContract = "CDWOFIP4YQJGMCYAOWLSRBAWN2OTJUG2I5WOFC32O2TX2SRU56RWBE5C";
const marketFactoryContract = "CBGX3EJFI3JRHSN5B533O2L5P57JFPTCRS55IPWFS5BNDXLJLXDWA5Z2";
const account = Keypair.random().publicKey();
const receiver = Keypair.random().publicKey();

type StoreBucket = Map<string, Record<string, unknown>>;

const buckets = new Map<string, StoreBucket>();
const logs: string[] = [];

beforeEach(() => {
  buckets.clear();
  logs.length = 0;

  (globalThis as Record<string, unknown>).store = {
    async set(entity: string, id: string, value: Record<string, unknown>) {
      bucket(entity).set(id, { ...value });
    },
    async get(entity: string, id: string) {
      return bucket(entity).get(id);
    },
    async getOneByField(entity: string, field: string, value: unknown) {
      return [...bucket(entity).values()].find((record) => record[field] === value);
    },
    async getByField(entity: string, field: string, value: unknown) {
      return [...bucket(entity).values()].filter((record) => record[field] === value);
    },
    async getByFields() {
      return [];
    },
    async remove(entity: string, id: string) {
      bucket(entity).delete(id);
    },
  };

  (globalThis as Record<string, unknown>).logger = {
    info(message: string) {
      logs.push(message);
    },
    warn(message: string) {
      logs.push(message);
    },
  };
});

describe("SO4 event dispatch", () => {
  test("decodes primitive ScVal fixtures", () => {
    const keyHex = "11".repeat(32);

    expect(decodeTopicName(xdr.ScVal.scvSymbol("pos_dec"))).toBe("pos_dec");
    expect(decodeAddress(Address.fromString(account).toScVal())).toBe(account);
    expect(decodeAddress(Address.fromString(marketToken).toScVal())).toBe(marketToken);
    expect(decodeBytesN32(xdr.ScVal.scvBytes(Buffer.from(keyHex, "hex")))).toBe(keyHex);
    expect(decodeBoolean(xdr.ScVal.scvBool(true))).toBe(true);
    expect(decodeInteger(nativeToScVal(-7n, { type: "i128" }))).toBe("-7");
    expect(decodeInteger(nativeToScVal(42n, { type: "u128" }))).toBe("42");
  });

  test("decodes ScMap payloads as named fields and Vec payloads as positional only", () => {
    const mapTuple = decodeTuple(
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("amount"),
          val: nativeToScVal(42n, { type: "u128" }),
        }),
      ]),
    );
    const vecTuple = decodeTuple(
      xdr.ScVal.scvVec([
        xdr.ScVal.scvSymbol("amount"),
        nativeToScVal(42n, { type: "u128" }),
      ]),
    );

    expect(mapTuple.named.amount).toBe("42");
    expect(mapTuple.list).toHaveLength(0);
    expect(vecTuple.list).toEqual(["amount", "42"]);
    expect(vecTuple.named).toEqual({});
  });

  test("decodes raw market event payloads with empty named fields", () => {
    const decoded = decodeSorobanEvent(
      rawEvent(
        "mkt_new",
        xdr.ScVal.scvVec([
          Address.fromString(marketToken).toScVal(),
          Address.fromString(indexToken).toScVal(),
          Address.fromString(indexToken).toScVal(),
          Address.fromString(shortToken).toScVal(),
        ]),
        marketFactoryContract,
      ),
    );

    expect(decoded?.eventName).toBe("mkt_new");
    expect(decoded?.contractAddress).toBe(marketFactoryContract);
    expect(decoded?.values.named).toEqual({});
    expect(decoded?.values.list).toEqual([marketToken, indexToken, indexToken, shortToken]);
  });

  test("indexes a raw positional position decrease event with source-verified indices", async () => {
    const positionKey = "22".repeat(32);
    const decoded = decodeSorobanEvent(
      rawEvent(
        "pos_dec",
        xdr.ScVal.scvVec([
          xdr.ScVal.scvBytes(Buffer.from(positionKey, "hex")),
          Address.fromString(account).toScVal(),
          nativeToScVal(500n, { type: "i128" }),
          nativeToScVal(2000n, { type: "i128" }),
          nativeToScVal(-25n, { type: "i128" }),
        ]),
      ),
    );

    expect(decoded?.values.named).toEqual({});
    await dispatchEvent(decoded!);

    const [position] = records("Position");
    const [change] = records("PositionChange");
    expect(position.id).toBe(`position:${positionKey}`);
    expect(position.account).toBe(account);
    expect(change.sizeDeltaUsd).toBe("500");
    expect(change.executionPrice).toBe("2000");
    expect(change.pnlUsd).toBe("-25");
  });

  test("indexes a market creation event idempotently", async () => {
    const event = so4Event("mkt_new", {
      market_token: marketToken,
      market: marketToken,
      creator: account,
      name: "TETH/TUSDC",
    });

    await dispatchEvent(event);
    await dispatchEvent(event);

    expect(records("Market")).toHaveLength(1);
    expect(records("MarketConfigSnapshot")).toHaveLength(1);
    expect(records("Market")[0].id).toBe(`market:${marketToken}`);
  });

  test("indexes deposit lifecycle updates by deterministic key", async () => {
    await dispatchEvent(so4Event("dep_crt", lifecyclePayload("dep-1")));
    await dispatchEvent(so4Event("dep_exe", lifecyclePayload("dep-1")));

    const [deposit] = records("Deposit");
    expect(records("Deposit")).toHaveLength(1);
    expect(deposit.id).toBe("deposit:dep-1");
    expect(deposit.status).toBe("EXECUTED");
    expect(deposit.createdLedger).toBe(100);
    expect(deposit.executedLedger).toBe(100);
  });

  test("indexes withdrawal lifecycle updates", async () => {
    await dispatchEvent(so4Event("wth_crt", lifecyclePayload("wth-1")));
    await dispatchEvent(so4Event("wth_can", lifecyclePayload("wth-1", { reason: "expired" })));

    const [withdrawal] = records("Withdrawal");
    expect(records("Withdrawal")).toHaveLength(1);
    expect(withdrawal.id).toBe("withdrawal:wth-1");
    expect(withdrawal.status).toBe("CANCELLED");
    expect(withdrawal.cancellationReason).toBe("expired");
  });

  test("indexes order lifecycle updates", async () => {
    await dispatchEvent(
      so4Event("ord_crt", lifecyclePayload("ord-1", { order_type: "MARKET", is_long: true })),
    );
    await dispatchEvent(
      so4Event("ord_upd", lifecyclePayload("ord-1", { order_type: "MARKET", acceptable_price: "2000" })),
    );

    const [order] = records("Order");
    expect(records("Order")).toHaveLength(1);
    expect(order.id).toBe("order:ord-1");
    expect(order.status).toBe("UPDATED");
    expect(order.isLong).toBe(true);
    expect(order.acceptablePrice).toBe("2000");
  });

  test("indexes position changes and current position state", async () => {
    await dispatchEvent(
      so4Event("pos_inc", {
        position_key: "pos-1",
        market: marketToken,
        account,
        collateral_token: marketToken,
        is_long: true,
        next_size_usd: "500000000000000000000000000000000",
      }),
    );

    expect(records("Position")).toHaveLength(1);
    expect(records("PositionChange")).toHaveLength(1);
    expect(records("Position")[0].id).toBe("position:pos-1");
    expect(records("PositionChange")[0].changeType).toBe("INCREASE");
  });

  test("indexes liquidation and ADL events", async () => {
    await dispatchEvent(
      so4Event("liq_exe", {
        liquidation_key: "liq-1",
        market: marketToken,
        account,
        liquidator: account,
        is_long: false,
      }),
    );
    await dispatchEvent(
      so4Event("adl_req", {
        adl_key: "adl-1",
        market: marketToken,
        account,
        is_long: true,
      }),
    );

    expect(records("Liquidation")[0].status).toBe("EXECUTED");
    expect(records("AdlEvent")[0].status).toBe("REQUESTED");
  });

  test("indexes fee and referral events", async () => {
    await dispatchEvent(so4Event("fee_clm", { key: "fee-1", account, amount: "42" }));
    await dispatchEvent(so4Event("ref_reg", { code: "STEINS", account }));
    await dispatchEvent(so4Event("ref_set", { trader: account, code: "STEINS", referrer: account }));

    expect(records("FeeClaim")[0].amount).toBe("42");
    expect(records("ReferralCode")[0].code).toBe("STEINS");
    expect(records("TraderReferral")[0].referralCodeId).toBe("referral:STEINS");
  });

  test("indexes token/faucet transfer-style events", async () => {
    await dispatchEvent(
      so4Event("transfer", {
        from: account,
        to: receiver,
        amount: "1000",
      }, marketToken),
    );

    const [transfer] = records("MarketTokenTransfer");
    expect(transfer.id).toBe("token-event:event-transfer");
    expect(transfer.transferType).toBe("transfer");
    expect(transfer.amount).toBe("1000");
  });

  test("logs and skips unknown events", async () => {
    await dispatchEvent(so4Event("mystery", {}));

    expect(records("Market")).toHaveLength(0);
    expect(logs.some((message) => message.includes("Skipping unknown SO4 event"))).toBe(true);
  });
});

function so4Event(
  eventName: string,
  named: Record<string, string | boolean>,
  contractAddress = handlerContract,
): DecodedEvent {
  return {
    id: `event-${eventName}`,
    contractAddress,
    eventName,
    ledger: 100,
    timestamp: new Date("2026-06-24T12:00:00Z"),
    transactionHash: `tx-${eventName}`,
    topic: [],
    values: {
      list: Object.values(named),
      named,
    },
  };
}

function lifecyclePayload(
  key: string,
  extra: Record<string, string | boolean> = {},
): Record<string, string | boolean> {
  return {
    key,
    market: marketToken,
    account,
    receiver: account,
    amount: "100",
    ...extra,
  };
}

function records(entity: string): Record<string, unknown>[] {
  return [...bucket(entity).values()];
}

function bucket(entity: string): StoreBucket {
  let value = buckets.get(entity);
  if (!value) {
    value = new Map();
    buckets.set(entity, value);
  }
  return value;
}

function rawEvent(eventName: string, value: xdr.ScVal, contractAddress = handlerContract) {
  return {
    id: `raw-${eventName}`,
    topic: [xdr.ScVal.scvSymbol(eventName)],
    value,
    contractId: Address.fromString(contractAddress).toScAddress(),
    ledger: { sequence: 100 },
    ledgerClosedAt: "2026-06-24T12:00:00Z",
    txHash: `tx-${eventName}`,
  } as never;
}
