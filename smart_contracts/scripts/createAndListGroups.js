const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
require("dotenv").config();

async function main() {
  await createAndListGroups();
}

async function createAndListGroups() {
  const { deployer } = await getNamedAccounts();

  console.log(`Deployer: ${deployer}`);

  const crypto4beer = await ethers.getContract("Beer4Crypto", deployer);

  console.log(`contract address: ${crypto4beer.address}`);

  const tx1 = await crypto4beer.createGroup("My Group");
  await tx1.wait();

  const groupList = await crypto4beer.listGroupsForMember(deployer);
  groupList.forEach((group) => {
    console.log(`Group: ${group}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
