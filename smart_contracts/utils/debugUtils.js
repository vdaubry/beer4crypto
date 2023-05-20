const { ethers, getNamedAccounts, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
require("dotenv").config()

const createGroup = async (deployer, name, nickname) => {
    console.log("createGroup called with: ", deployer, name, nickname)
    const crypto4beer = await ethers.getContract("Beer4Crypto", deployer)

    const tx1 = await crypto4beer.createGroup(name, nickname)
    const receipt = await tx1.wait()
    const event = receipt.events?.find((event_params) => event_params.event === "GroupCreated")
    return event?.args?.id
}

const inviteMember = async (deployer, account, nickname, id) => {
    console.log(`inviteMember called with: account: ${account}, nickname: ${nickname}, id: ${id}`)
    const crypto4beer = await ethers.getContract("Beer4Crypto", deployer)

    const tx1 = await crypto4beer.inviteMember(account, nickname, id)
    await tx1.wait()
}

const listMemberGroups = async (account) => {
    console.log(`Account: ${account}`)
    const { deployer } = await getNamedAccounts()
    const crypto4beer = await ethers.getContract("Beer4Crypto", deployer)

    const groupList = await crypto4beer.listMemberGroups(account)
    console.log(`Group List count: ${groupList.length}`)
    groupList.forEach((group) => {
        console.log(`Group: ${group}`)
    })
}

const listGroupMembers = async (id) => {
    console.log(`group_id: ${id}`)
    const { deployer } = await getNamedAccounts()
    console.log(`deployer: ${deployer}`)
    const crypto4beer = await ethers.getContract("Beer4Crypto", deployer)

    const groupList = await crypto4beer.listGroupMembers(id)
    groupList.forEach((member) => {
        console.log(`member: ${member}`)
    })
}

module.exports = {
    createGroup,
    inviteMember,
    listMemberGroups,
    listGroupMembers,
}
