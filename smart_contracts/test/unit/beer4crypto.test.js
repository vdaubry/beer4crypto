const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

if (!developmentChains.includes(network.name)) {
  describe.skip;
} else {
  describe("beer4crypto", () => {
    let deployer, provider;

    beforeEach(async () => {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;
      provider = ethers.provider;

      beer4crypto = await ethers.getContract("Beer4Crypto", deployer);
    });

    const getGroupIdFromTx = async (tx) => {
      const receipt = await tx.wait();
      const event = receipt.events?.find(
        (event) => event.event === "GroupCreated"
      );
      return event?.args?.id;
    };

    const createGroup = async (
      groupName = "Test Group",
      userNickname = "Test User"
    ) => {
      const tx = await beer4crypto.createGroup(groupName, userNickname);
      const groupId = await getGroupIdFromTx(tx);
      return groupId;
    };

    describe("createGroup", function () {
      it("should emit GroupCreated event", async function () {
        const tx = await beer4crypto.createGroup("foo", "bar");
        const receipt = await tx.wait();
        const event = receipt.events?.find(
          (event) => event.event === "GroupCreated"
        );

        expect(event?.args?.name).to.equal("foo");
        expect(event?.args?.id).to.exist;
      });

      it("should allow group with existing name", async function () {
        const groupName = "My Group";
        await beer4crypto.createGroup(groupName, "foo");
        await expect(beer4crypto.createGroup(groupName, "foo")).to.not.be
          .reverted;
      });
    });

    describe("isMember", function () {
      it("should add the creator to the group members", async function () {
        const groupId = await createGroup();

        const isMember = await beer4crypto.isMember(groupId, deployer);
        expect(isMember).to.equal(true);
      });
    });

    describe("ListGroupsForMember", function () {
      it("should return the group ids", async function () {
        const groupId = await createGroup("MyGroup");

        const groupIds = await beer4crypto.listGroupsForMember(deployer);
        expect(groupIds[0].id).to.equal(groupId);
        expect(groupIds[0].name).to.equal("MyGroup");
      });
    });

    describe("ListMembersForgroup", function () {
      it("should return the members for a group", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname");

        const members = await beer4crypto.listMembersForGroup(groupId);
        expect(members[0].memberAddress).to.equal(deployer);
        expect(members[0].nickname).to.equal("DeployerNickname");
      });
    });

    describe("InviteMember", function () {
      it("should add the invited member to the group", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname");
        const invited = await ethers.getSigner(1);
        const invitedAddress = await invited.getAddress();

        await beer4crypto.inviteMember(
          invitedAddress,
          "User Nickname",
          groupId
        );

        const groupMembers = await beer4crypto.listMembersForGroup(groupId);
        expect(groupMembers[0].memberAddress).to.equal(deployer);
        expect(groupMembers[1].memberAddress).to.equal(invitedAddress);
      });

      it("should emit MemberInvited event", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname");
        const invited = await ethers.getSigner(1);
        const invitedAddress = await invited.getAddress();

        const tx = await beer4crypto.inviteMember(
          invitedAddress,
          "User Nickname",
          groupId
        );
        const receipt = await tx.wait();
        const event = receipt.events?.find(
          (event) => event.event === "MemberInvited"
        );

        expect(event?.args?.groupId).to.equal(groupId);
        expect(event?.args?.memberAddress).to.equal(invitedAddress);
        expect(event?.args?.nickname).to.equal("User Nickname");
      });

      it("should not allow non-members to invite", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname");
        const invited = await ethers.getSigner(1);
        const invitedAddress = await invited.getAddress();

        await expect(
          beer4crypto
            .connect(invited)
            .inviteMember(invitedAddress, "User Nickname", groupId)
        ).to.be.revertedWith("Only members can call this function");
      });
    });
  });
}
