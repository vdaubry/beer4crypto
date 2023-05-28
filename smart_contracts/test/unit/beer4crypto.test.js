const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("beer4crypto", () => {
        let deployer

        beforeEach(async () => {
            await deployments.fixture(["all"])
            deployer = (await getNamedAccounts()).deployer
            provider = ethers.provider

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
                    beer4crypto
                        .connect(invited)
                        .inviteMember(invitedAddress, "User Nickname", groupId)
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

                await beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)

                const event = await beer4crypto.getGroupEvent(groupId, eventDate)
                expect(event.eventDate).to.equal(eventDate)
                expect(event.minDeposit).to.equal(minDeposit)
                expect(event.groupId).to.equal(groupId)
                expect(event.maxBetDate).to.equal(maxBetDate)
            })

            it("should revert if event date is in the past", async function () {
                const eventDate = Math.floor(Date.now() / 1000) - 86400 // 1 day ago
                const minDeposit = ethers.utils.parseEther("1")
                const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

                await expect(
                    beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)
                ).to.be.revertedWith("Event date must be in the future")
            })

            it("should revert if max bet date is greater than event date", async function () {
                const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
                const minDeposit = ethers.utils.parseEther("1")
                const maxBetDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now

                await expect(
                    beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)
                ).to.be.revertedWith("Event date after max bet date")
            })

            it("should revert if event date already exist for same group", async function () {
                const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
                const minDeposit = ethers.utils.parseEther("1")
                const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

                beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)

                await expect(
                    beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)
                ).to.be.revertedWith("Event already exists")
            })

            it("should not revert if event date already exist for another group", async function () {
                const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
                const minDeposit = ethers.utils.parseEther("1")
                const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

                beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)

                const groupId2 = await createGroup("MyGroup2", "DeployerNickname")
                await expect(beer4crypto.createEvent(eventDate, minDeposit, groupId2, maxBetDate))
                    .to.not.be.reverted
            })
        })

        describe("createBet", function () {
            let groupId, eventId, predictedEthprice, minDeposit

            beforeEach(async () => {
                groupId = await createGroup("MyGroup", "DeployerNickname")
                const eventDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
                minDeposit = ethers.utils.parseEther("1")
                const maxBetDate = Math.floor(Date.now() / 1000) + 43200 // 12 hours from now

                await beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)
                let event = await beer4crypto.getGroupEvent(groupId, eventDate)
                eventId = event.id
                predictedEthprice = ethers.utils.parseEther("1.2")
            })

            it("should create a bet", async function () {
                await beer4crypto.createBet(eventId, predictedEthprice, {
                    value: minDeposit,
                })

                let now = Math.floor(Date.now() / 1000)

                const bet = await beer4crypto.getBet(eventId, deployer)
                expect(bet.betDate).to.be.within(now - 5, now + 5)
                expect(bet.predictedEthPrice).to.equal(predictedEthprice)
                expect(bet.amountDeposited).to.equal(minDeposit)
                expect(bet.eventId).to.equal(eventId)
            })

            it("should revert if event does not exist", async function () {
                await expect(
                    beer4crypto.createBet(
                        "0xdb0a3e968962228da6a479aa5aa7f05a9a35660c757c2a88031f88dfd453a834",
                        predictedEthprice,
                        { value: minDeposit }
                    )
                ).to.be.revertedWith("Event does not exist")
            })

            it("should revert if event maxBetDate in the past", async function () {
                const eventDate = Math.floor(Date.now() / 1000) + 86400 * 2 // 2 day from now
                const maxBetDate = Math.floor(Date.now() / 1000) - 43200 // 12 hours ago

                await beer4crypto.createEvent(eventDate, minDeposit, groupId, maxBetDate)
                let event = await beer4crypto.getGroupEvent(groupId, eventDate)
                eventId = event.id

                await expect(
                    beer4crypto.createBet(eventId, predictedEthprice, { value: minDeposit })
                ).to.be.revertedWith("Bets are closed")
            })

            it("should revert if bet amount is less than minDeposit", async function () {
                await expect(
                    beer4crypto.createBet(eventId, predictedEthprice, {
                        value: ethers.utils.parseEther("0.5"),
                    })
                ).to.be.revertedWith("Min Bet amount is not met")
            })

            it("should revert if caller is not a member of the group", async function () {
                const user1 = (await getNamedAccounts()).user1
                const signer = await ethers.getSigner(user1)
                const connectedBeer4Crypto = await beer4crypto.connect(signer)

                await expect(
                    connectedBeer4Crypto.createBet(eventId, predictedEthprice, {
                        value: minDeposit,
                    })
                ).to.be.revertedWith("Caller not a group member")
            })

            it("should revert if caller already has a bet for the event", async function () {
                await beer4crypto.createBet(eventId, predictedEthprice, { value: minDeposit })
                await expect(
                    beer4crypto.createBet(eventId, predictedEthprice, { value: minDeposit })
                ).to.be.revertedWith("Bet already exists")
            })
        })
    })
}
