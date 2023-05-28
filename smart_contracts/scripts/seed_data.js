const { ethers, getNamedAccounts, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
require("dotenv").config()
const {
    createGroup,
    inviteMember,
    createGroupEvent,
    createBet,
    getGroup,
} = require("../utils/debugUtils")

async function main() {
    const { deployer, user1, user2 } = await getNamedAccounts()
    const MIN_DEPOSIT = ethers.utils.parseEther("0.1")

    // Create an populate Group1
    const group1Id = await createGroup(deployer, "Group1", "deployer")
    console.log(`group created with id: ${group1Id}`)
    await inviteMember(deployer, user1, "user1", group1Id)
    await inviteMember(deployer, user2, "user2", group1Id)

    // Create an populate Group2
    const group2Id = await createGroup(deployer, "Group2", "deployer")
    await inviteMember(deployer, user1, "user1", group2Id)

    // Create an populate Group3
    const group3Id = await createGroup(user1, "Group3", "user1")
    await inviteMember(user1, user2, "user2", group3Id)

    // Create events for Group1
    const group1Event1 = await createGroupEvent(
        deployer,
        group1Id,
        new Date("01/30/2025").getTime(),
        MIN_DEPOSIT,
        new Date("01/23/2025").getTime()
    )
    const group1Event2 = await createGroupEvent(
        deployer,
        group1Id,
        new Date("03/20/2025").getTime(),
        MIN_DEPOSIT,
        new Date("03/13/2025").getTime()
    )

    // // Create bets for Group1 Event1
    // await createBet(deployer, group1Event1.id, 1850, MIN_DEPOSIT)
    // await createBet(user1, group1Event1.id, 1950, MIN_DEPOSIT)

    // // Create bets for Group1 Event2
    // await createBet(deployer, group1Event2.id, 1850, MIN_DEPOSIT)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
