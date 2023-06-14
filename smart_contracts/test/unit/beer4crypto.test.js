const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

if (!developmentChains.includes(network.name)) {
  describe.skip
} else {
  describe("beer4crypto", () => {
    let deployer, user1, user2

    beforeEach(async () => {
      await deployments.fixture(["all"])
      deployer = (await getNamedAccounts()).deployer
      provider = ethers.provider
      user1 = (await getNamedAccounts()).user1
      user2 = (await getNamedAccounts()).user2

      beer4crypto = await ethers.getContract("Beer4Crypto", deployer)
    })

    const getGroupIdFromTx = async (tx) => {
      const receipt = await tx.wait()
      const event = receipt.events?.find((event) => event.event === "GroupCreated")
      return event?.args?.id
    }

    const createGroup = async (groupName = "Test Group", userNickname = "Test User") => {
      const tx = await beer4crypto.createGroup(groupName, userNickname)
      const groupId = await getGroupIdFromTx(tx)
      return groupId
    }

    describe("createGroup", function () {
      it("should emit GroupCreated event", async function () {
        const tx = await beer4crypto.createGroup("foo", "bar")
        const receipt = await tx.wait()
        const event = receipt.events?.find((event) => event.event === "GroupCreated")

        expect(event?.args?.name).to.equal("foo")
        expect(event?.args?.id).to.exist
      })

      it("should allow group with existing name", async function () {
        const groupName = "My Group"
        await beer4crypto.createGroup(groupName, "foo")
        await expect(beer4crypto.createGroup(groupName, "foo")).to.not.be.reverted
      })
    })

    describe("isMember", function () {
      it("should add the creator to the group members", async function () {
        const groupId = await createGroup()

        const isMember = await beer4crypto.isMember(groupId, deployer)
        expect(isMember).to.equal(true)
      })
    })

    describe("InviteMember", function () {
      it("should add the invited member to the group", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname")
        const invited = await ethers.getSigner(1)
        const invitedAddress = await invited.getAddress()

        await beer4crypto.inviteMember(invitedAddress, "User Nickname", groupId)

        const isMember = await beer4crypto.isMember(groupId, invitedAddress)
        expect(isMember).to.equal(true)
      })

      it("should emit MemberInvited event", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname")
        const invited = await ethers.getSigner(1)
        const invitedAddress = await invited.getAddress()

        const tx = await beer4crypto.inviteMember(invitedAddress, "User Nickname", groupId)
        const receipt = await tx.wait()
        const event = receipt.events?.find((event) => event.event === "MemberInvited")

        expect(event?.args?.groupId).to.equal(groupId)
        expect(event?.args?.memberAddress).to.equal(invitedAddress)
        expect(event?.args?.nickname).to.equal("User Nickname")
      })

      it("should not allow non-members to invite", async function () {
        const groupId = await createGroup("MyGroup", "DeployerNickname")
        const invited = await ethers.getSigner(1)
        const invitedAddress = await invited.getAddress()

        await expect(
          beer4crypto.connect(invited).inviteMember(invitedAddress, "User Nickname", groupId)
        ).to.be.revertedWith("Caller not a group member")
      })
    })

    describe("Create event", function () {
      let groupId
      beforeEach(async () => {
        groupId = await createGroup("MyGroup", "DeployerNickname")
      })

      it("should create an event", async function () {
        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        const minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        await beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)

        const event = await beer4crypto.getGroupEvent(groupId, eventDate)
        expect(event.eventDate).to.equal(eventDate)
        expect(event.minDeposit).to.equal(minDeposit)
        expect(event.groupId).to.equal(groupId)
        expect(event.maxBetDate).to.equal(maxBetDate)
        expect(event.actualEthPrice).to.equal(0)
        expect(event.winner).to.equal("0x0000000000000000000000000000000000000000")
        expect(event.totalAmountDeposited).to.equal(0)
      })

      it("should revert if event date is in the past", async function () {
        const eventDate = Math.floor(Date.now() / 1000) - 86400 // 1 day ago
        const minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        await expect(
          beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        ).to.be.revertedWith("Event date must be in the future")
      })

      it("should revert if max bet date is greater than event date", async function () {
        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        const minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now

        await expect(
          beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        ).to.be.revertedWith("Event date after max bet date")
      })

      it("should revert if event date already exist for same group", async function () {
        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        const minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)

        await expect(
          beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        ).to.be.revertedWith("Event already exists")
      })

      it("should not revert if event date already exist for another group", async function () {
        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        const minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)

        const groupId2 = await createGroup("MyGroup2", "DeployerNickname")
        await expect(beer4crypto.createGroupEvent(eventDate, minDeposit, groupId2, maxBetDate)).to
          .not.be.reverted
      })
    })

    describe("createBet", function () {
      let groupId, event, predictedEthprice, minDeposit

      beforeEach(async () => {
        groupId = await createGroup("MyGroup", "DeployerNickname")
        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        await beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        event = await beer4crypto.getGroupEvent(groupId, eventDate)
        predictedEthprice = "1000"
      })

      it("should create a bet and update totalAmountDeposited", async function () {
        await beer4crypto.createBet(event.id, predictedEthprice, {
          value: minDeposit,
        })

        let now = Math.floor(Date.now() / 1000)

        const bet = await beer4crypto.getBet(event.id, deployer)

        expect(bet.betDate).to.be.within(now - 5, now + 5)
        expect(bet.predictedEthPrice).to.equal(predictedEthprice)
        expect(bet.amountDeposited).to.equal(minDeposit)
        expect(bet.eventId).to.equal(event.id)

        const updatedEvent = await beer4crypto.getGroupEvent(groupId, event.eventDate)
        expect(updatedEvent.totalAmountDeposited).to.equal(minDeposit)
      })

      it("should revert if event maxBetDate in the past", async function () {
        const eventDate = Math.floor(Date.now() / 1000) + 86400 * 2 // 2 day from now
        const maxBetDate = Math.floor(Date.now() / 1000) - 43200 // 12 hours ago

        await beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        event = await beer4crypto.getGroupEvent(groupId, eventDate)

        await expect(
          beer4crypto.createBet(event.id, predictedEthprice, { value: minDeposit })
        ).to.be.revertedWith("Bets are closed")
      })

      it("should revert if bet amount is less than minDeposit", async function () {
        await expect(
          beer4crypto.createBet(event.id, predictedEthprice, {
            value: ethers.utils.parseEther("0.5"),
          })
        ).to.be.revertedWith("Min Bet amount is not met")
      })

      it("should revert if caller is not a member of the group", async function () {
        const signer = await ethers.getSigner(user1)
        const connectedBeer4Crypto = await beer4crypto.connect(signer)

        await expect(
          connectedBeer4Crypto.createBet(event.id, predictedEthprice, {
            value: minDeposit,
          })
        ).to.be.revertedWith("Caller not a group member")
      })

      it("should revert if caller already has a bet for the event", async function () {
        await beer4crypto.createBet(event.id, predictedEthprice, { value: minDeposit })
        await expect(
          beer4crypto.createBet(event.id, predictedEthprice, { value: minDeposit })
        ).to.be.revertedWith("Bet already exists")
      })
    })

    describe("pickWinner", function () {
      let groupId, event, minDeposit

      beforeEach(async () => {
        groupId = await createGroup("MyGroup", "DeployerNickname")

        await beer4crypto.inviteMember(user1, "User1 Nickname", groupId)
        await beer4crypto.inviteMember(user2, "User2 Nickname", groupId)

        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        await beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        event = await beer4crypto.getGroupEvent(groupId, eventDate)
      })

      context("with no bets", function () {
        it("should revert", async function () {
          await time.increase(86400) // 1 day
          await expect(beer4crypto.pickWinner(event.id)).to.be.revertedWith("No bets")
        })
      })

      context("with bets", function () {
        beforeEach(async () => {
          const user1PredictedEthprice = "1900"
          const signer1 = await ethers.getSigner(user1)
          const user1ConnectedBeer4Crypto = await beer4crypto.connect(signer1)
          await user1ConnectedBeer4Crypto.createBet(event.id, user1PredictedEthprice, {
            value: minDeposit,
          })

          const user2PredictedEthprice = "2050"
          const signer2 = await ethers.getSigner(user2)
          const user2ConnectedBeer4Crypto = await beer4crypto.connect(signer2)
          await user2ConnectedBeer4Crypto.createBet(event.id, user2PredictedEthprice, {
            value: minDeposit,
          })
        })

        context("event ended", function () {
          beforeEach(async () => {
            await time.increase(86400) // 1 day
          })
          it("should pick winner with closest predicted ETH price", async function () {
            await beer4crypto.pickWinner(event.id)

            const groupEvent = await beer4crypto.getGroupEvent(groupId, event.eventDate)
            expect(groupEvent.winner).to.equal(user2)
            expect(groupEvent.actualEthPrice).to.equal("2000")
          })

          it("should revert if winner has already been picked", async function () {
            await beer4crypto.pickWinner(event.id)
            await expect(beer4crypto.pickWinner(event.id)).to.be.revertedWith(
              "Winner already picked"
            )
          })

          context("user is not member of the group", function () {
            it("should revert", async function () {
              const user3 = (await getNamedAccounts()).user3
              const signer = await ethers.getSigner(user3)
              const connectedBeer4Crypto = await beer4crypto.connect(signer)

              await expect(connectedBeer4Crypto.pickWinner(event.id)).to.be.revertedWith(
                "Caller not a group member"
              )
            })
          })
        })
      })

      context("event not ended", function () {
        it("should revert", async function () {
          await expect(beer4crypto.pickWinner(event.id)).to.be.revertedWith("Event not ended yet")
        })
      })
    })

    describe.only("withdraw", function () {
      let groupId, event, minDeposit

      beforeEach(async () => {
        groupId = await createGroup("MyGroup", "DeployerNickname")

        await beer4crypto.inviteMember(user1, "User1 Nickname", groupId)
        await beer4crypto.inviteMember(user2, "User2 Nickname", groupId)

        const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
        minDeposit = ethers.utils.parseEther("1")
        const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

        await beer4crypto.createGroupEvent(eventDate, minDeposit, groupId, maxBetDate)
        event = await beer4crypto.getGroupEvent(groupId, eventDate)

        const user1PredictedEthprice = "1900"
        const signer1 = await ethers.getSigner(user1)
        const user1ConnectedBeer4Crypto = await beer4crypto.connect(signer1)
        await user1ConnectedBeer4Crypto.createBet(event.id, user1PredictedEthprice, {
          value: minDeposit,
        })

        const user2PredictedEthprice = "2050"
        const signer2 = await ethers.getSigner(user2)
        const user2ConnectedBeer4Crypto = await beer4crypto.connect(signer2)
        await user2ConnectedBeer4Crypto.createBet(event.id, user2PredictedEthprice, {
          value: minDeposit,
        })

        await time.increase(86400) // 1 day

        await beer4crypto.pickWinner(event.id)
      })

      context("user is not winner", function () {
        it("should revert", async function () {
          const signer = await ethers.getSigner(user1)
          const connectedBeer4Crypto = await beer4crypto.connect(signer)

          await expect(connectedBeer4Crypto.withdraw(event.id)).to.be.revertedWith(
            "Caller not winner"
          )
        })
      })

      context("user is winner", function () {
        it("should withdraw funds", async function () {
          const signer = await ethers.getSigner(user2)
          const connectedBeer4Crypto = await beer4crypto.connect(signer)

          const balanceBefore = await ethers.provider.getBalance(user2)
          await connectedBeer4Crypto.withdraw(event.id)
          const balanceAfter = await ethers.provider.getBalance(user2)

          expect(balanceAfter.sub(balanceBefore)).to.be.closeTo(
            minDeposit.mul(2),
            ethers.utils.parseEther("0.1")
          )
        })

        it("should revert if funds have already been withdrawn", async function () {
          const signer = await ethers.getSigner(user2)
          const connectedBeer4Crypto = await beer4crypto.connect(signer)

          await connectedBeer4Crypto.withdraw(event.id)
          await expect(connectedBeer4Crypto.withdraw(event.id)).to.be.revertedWith(
            "No funds to withdraw"
          )
        })
      })
    })
  })
}
