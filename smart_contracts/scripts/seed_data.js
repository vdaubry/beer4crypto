const { ethers, getNamedAccounts, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
require("dotenv").config()
const { createAndListGroups, createGroup, inviteMember } = require("../utils/debugUtils")

async function main() {
    const { deployer, user1, user2 } = await getNamedAccounts()

    // Create an populate Group1
    const group1Id = await createGroup(deployer, "Group1", "deployer")
    await inviteMember(deployer, user1, "user1", group1Id)
    await inviteMember(deployer, user2, "user2", group1Id)

    // Create an populate Group2
    const group2Id = await createGroup(deployer, "Group2", "deployer")
    await inviteMember(deployer, user1, "user1", group2Id)

    // Create an populate Group3
    const group3Id = await createGroup(user1, "Group3", "user1")
    await inviteMember(user1, user2, "user2", group3Id)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
