const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
require("dotenv").config();

const createAndListGroups = async () => {
  const { deployer } = await getNamedAccounts();
  const crypto4beer = await ethers.getContract("Beer4Crypto", deployer);
  const tx1 = await crypto4beer.createGroup("My Group", "MyNickname");
  await tx1.wait();

  await listMemberGroups(deployer);
}

const listMemberGroups = async (account) => {
  console.log(`Account: ${account}`);
  const { deployer } = await getNamedAccounts();
  const crypto4beer = await ethers.getContract("Beer4Crypto", deployer);

  const groupList = await crypto4beer.listMemberGroups(account);
  console.log(`Group List count: ${groupList.length}`)
  groupList.forEach((group) => {
    console.log(`Group: ${group}`);
  });
}

const listGroupMembers = async (id) => {
  console.log(`group_id: ${id}`);
  const { deployer } = await getNamedAccounts();
  console.log(`deployer: ${deployer}`);
  const crypto4beer = await ethers.getContract("Beer4Crypto", deployer);

  const groupList = await crypto4beer.listGroupMembers(id);
  groupList.forEach((member) => {
    console.log(`member: ${member}`);
  });
}


module.exports = {
    createAndListGroups,
    listMemberGroups,
    listGroupMembers
};