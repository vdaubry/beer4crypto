import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { BetCreated } from "../generated/schema"
import { BetCreated as BetCreatedEvent } from "../generated/Beer4Crypto/Beer4Crypto"
import { handleBetCreated } from "../src/beer-4-crypto"
import { createBetCreatedEvent } from "./beer-4-crypto-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let pickWinnerDate = BigInt.fromI32(234)
    let minDeposit = BigInt.fromI32(234)
    let groupId = Bytes.fromI32(1234567890)
    let maxBetDateInterval = BigInt.fromI32(234)
    let newBetCreatedEvent = createBetCreatedEvent(
      creator,
      pickWinnerDate,
      minDeposit,
      groupId,
      maxBetDateInterval
    )
    handleBetCreated(newBetCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BetCreated created and stored", () => {
    assert.entityCount("BetCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pickWinnerDate",
      "234"
    )
    assert.fieldEquals(
      "BetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "minDeposit",
      "234"
    )
    assert.fieldEquals(
      "BetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "groupId",
      "1234567890"
    )
    assert.fieldEquals(
      "BetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "maxBetDateInterval",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
