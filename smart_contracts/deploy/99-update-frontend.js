const fs = require("fs");
const { network, ethers } = require("hardhat");

const frontendAddressesFile = "../frontend/constants/contract_addresses.json";
const frontendContractAbiFile = "../frontend/constants/contract_abi.json";

module.exports = async (hre) => {
  await updateAddresses();
  await updateAbi();
};

const updateAddresses = async () => {
  //const contract = await ethers.getContract("VestingManager");
  const vesting_token = await ethers.getContract("Vesting");
  const adresses = JSON.parse(fs.readFileSync(frontendAddressesFile, "utf8"));
  const chainId = network.config.chainId;

  adresses[chainId] = {
    //contract: contract.address,
    vesting_token: vesting_token.address,
  };

  fs.writeFileSync(frontendAddressesFile, JSON.stringify(adresses));
};

const updateAbi = async () => {
  // const contract = await ethers.getContract("VestingManager");
  // fs.writeFileSync(
  //   frontendContractAbiFile,
  //   contract.interface.format(ethers.utils.FormatTypes.json)
  // );
};

module.exports.tags = ["all", "frontend"];
