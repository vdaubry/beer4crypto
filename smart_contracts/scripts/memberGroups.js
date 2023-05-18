const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
require("dotenv").config();
const { listMemberGroups } = require("../utils/debugUtils");


async function main() {
  const { deployer: account } = await getNamedAccounts();
  await listMemberGroups(account);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
