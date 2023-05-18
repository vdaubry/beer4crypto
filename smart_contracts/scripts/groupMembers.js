const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
require("dotenv").config();
const { listGroupMembers } = require("../utils/debugUtils");


async function main() {
  group_id = "0x5f134af709b569df131f48beadb4e289725895742daa39a629758d62bb20735a";
  await listGroupMembers(group_id);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
