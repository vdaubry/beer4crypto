// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class BetCreated extends ethereum.Event {
  get params(): BetCreated__Params {
    return new BetCreated__Params(this);
  }
}

export class BetCreated__Params {
  _event: BetCreated;

  constructor(event: BetCreated) {
    this._event = event;
  }

  get creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get groupId(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get amountDeposited(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get predictedEthPrice(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get eventId(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class EventCreated extends ethereum.Event {
  get params(): EventCreated__Params {
    return new EventCreated__Params(this);
  }
}

export class EventCreated__Params {
  _event: EventCreated;

  constructor(event: EventCreated) {
    this._event = event;
  }

  get eventId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get creator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get eventDate(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get minDeposit(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get groupId(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get maxBetDate(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class GroupCreated extends ethereum.Event {
  get params(): GroupCreated__Params {
    return new GroupCreated__Params(this);
  }
}

export class GroupCreated__Params {
  _event: GroupCreated;

  constructor(event: GroupCreated) {
    this._event = event;
  }

  get name(): string {
    return this._event.parameters[0].value.toString();
  }

  get id(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class MemberInvited extends ethereum.Event {
  get params(): MemberInvited__Params {
    return new MemberInvited__Params(this);
  }
}

export class MemberInvited__Params {
  _event: MemberInvited;

  constructor(event: MemberInvited) {
    this._event = event;
  }

  get groupId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get memberAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get nickname(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class Beer4Crypto__getBetResultValue0Struct extends ethereum.Tuple {
  get creator(): Address {
    return this[0].toAddress();
  }

  get betDate(): BigInt {
    return this[1].toBigInt();
  }

  get predictedEthPrice(): BigInt {
    return this[2].toBigInt();
  }

  get amountDeposited(): BigInt {
    return this[3].toBigInt();
  }

  get status(): i32 {
    return this[4].toI32();
  }

  get eventId(): Bytes {
    return this[5].toBytes();
  }
}

export class Beer4Crypto__getGroupEventResultValue0Struct extends ethereum.Tuple {
  get id(): Bytes {
    return this[0].toBytes();
  }

  get creator(): Address {
    return this[1].toAddress();
  }

  get eventDate(): BigInt {
    return this[2].toBigInt();
  }

  get minDeposit(): BigInt {
    return this[3].toBigInt();
  }

  get ended(): boolean {
    return this[4].toBoolean();
  }

  get groupId(): Bytes {
    return this[5].toBytes();
  }

  get maxBetDate(): BigInt {
    return this[6].toBigInt();
  }

  get actualEthPrice(): BigInt {
    return this[7].toBigInt();
  }
}

export class Beer4Crypto extends ethereum.SmartContract {
  static bind(address: Address): Beer4Crypto {
    return new Beer4Crypto("Beer4Crypto", address);
  }

  getBet(
    eventId: Bytes,
    memberAddress: Address
  ): Beer4Crypto__getBetResultValue0Struct {
    let result = super.call(
      "getBet",
      "getBet(bytes32,address):((address,uint256,uint256,uint256,uint8,bytes32))",
      [
        ethereum.Value.fromFixedBytes(eventId),
        ethereum.Value.fromAddress(memberAddress)
      ]
    );

    return changetype<Beer4Crypto__getBetResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getBet(
    eventId: Bytes,
    memberAddress: Address
  ): ethereum.CallResult<Beer4Crypto__getBetResultValue0Struct> {
    let result = super.tryCall(
      "getBet",
      "getBet(bytes32,address):((address,uint256,uint256,uint256,uint8,bytes32))",
      [
        ethereum.Value.fromFixedBytes(eventId),
        ethereum.Value.fromAddress(memberAddress)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<Beer4Crypto__getBetResultValue0Struct>(value[0].toTuple())
    );
  }

  getGroupEvent(
    groupId: Bytes,
    eventDate: BigInt
  ): Beer4Crypto__getGroupEventResultValue0Struct {
    let result = super.call(
      "getGroupEvent",
      "getGroupEvent(bytes32,uint256):((bytes32,address,uint256,uint256,bool,bytes32,uint256,uint256))",
      [
        ethereum.Value.fromFixedBytes(groupId),
        ethereum.Value.fromUnsignedBigInt(eventDate)
      ]
    );

    return changetype<Beer4Crypto__getGroupEventResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getGroupEvent(
    groupId: Bytes,
    eventDate: BigInt
  ): ethereum.CallResult<Beer4Crypto__getGroupEventResultValue0Struct> {
    let result = super.tryCall(
      "getGroupEvent",
      "getGroupEvent(bytes32,uint256):((bytes32,address,uint256,uint256,bool,bytes32,uint256,uint256))",
      [
        ethereum.Value.fromFixedBytes(groupId),
        ethereum.Value.fromUnsignedBigInt(eventDate)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<Beer4Crypto__getGroupEventResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  isMember(groupId: Bytes, member: Address): boolean {
    let result = super.call("isMember", "isMember(bytes32,address):(bool)", [
      ethereum.Value.fromFixedBytes(groupId),
      ethereum.Value.fromAddress(member)
    ]);

    return result[0].toBoolean();
  }

  try_isMember(groupId: Bytes, member: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isMember", "isMember(bytes32,address):(bool)", [
      ethereum.Value.fromFixedBytes(groupId),
      ethereum.Value.fromAddress(member)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class CreateBetCall extends ethereum.Call {
  get inputs(): CreateBetCall__Inputs {
    return new CreateBetCall__Inputs(this);
  }

  get outputs(): CreateBetCall__Outputs {
    return new CreateBetCall__Outputs(this);
  }
}

export class CreateBetCall__Inputs {
  _call: CreateBetCall;

  constructor(call: CreateBetCall) {
    this._call = call;
  }

  get eventId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get predictedEthPrice(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class CreateBetCall__Outputs {
  _call: CreateBetCall;

  constructor(call: CreateBetCall) {
    this._call = call;
  }
}

export class CreateEventCall extends ethereum.Call {
  get inputs(): CreateEventCall__Inputs {
    return new CreateEventCall__Inputs(this);
  }

  get outputs(): CreateEventCall__Outputs {
    return new CreateEventCall__Outputs(this);
  }
}

export class CreateEventCall__Inputs {
  _call: CreateEventCall;

  constructor(call: CreateEventCall) {
    this._call = call;
  }

  get eventDate(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get minDeposit(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get groupId(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get maxBetDate(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class CreateEventCall__Outputs {
  _call: CreateEventCall;

  constructor(call: CreateEventCall) {
    this._call = call;
  }
}

export class CreateGroupCall extends ethereum.Call {
  get inputs(): CreateGroupCall__Inputs {
    return new CreateGroupCall__Inputs(this);
  }

  get outputs(): CreateGroupCall__Outputs {
    return new CreateGroupCall__Outputs(this);
  }
}

export class CreateGroupCall__Inputs {
  _call: CreateGroupCall;

  constructor(call: CreateGroupCall) {
    this._call = call;
  }

  get groupName(): string {
    return this._call.inputValues[0].value.toString();
  }

  get nickname(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class CreateGroupCall__Outputs {
  _call: CreateGroupCall;

  constructor(call: CreateGroupCall) {
    this._call = call;
  }
}

export class InviteMemberCall extends ethereum.Call {
  get inputs(): InviteMemberCall__Inputs {
    return new InviteMemberCall__Inputs(this);
  }

  get outputs(): InviteMemberCall__Outputs {
    return new InviteMemberCall__Outputs(this);
  }
}

export class InviteMemberCall__Inputs {
  _call: InviteMemberCall;

  constructor(call: InviteMemberCall) {
    this._call = call;
  }

  get memberAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get memberNickname(): string {
    return this._call.inputValues[1].value.toString();
  }

  get groupId(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class InviteMemberCall__Outputs {
  _call: InviteMemberCall;

  constructor(call: InviteMemberCall) {
    this._call = call;
  }
}
