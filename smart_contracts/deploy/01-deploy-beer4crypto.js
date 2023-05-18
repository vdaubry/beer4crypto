const { network, ethers } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  /***********************************
   *
   * Deploy smart contract
   *
   ************************************/

  log("---------------------------------");
  log(`Deploy Beer4Crypto with owner : ${deployer}`);

  const deployerEthBalance = await ethers.provider.getBalance(deployer);
  console.log(
    `Deployer balance: ${ethers.utils.formatEther(deployerEthBalance)} ETH`
  );

  const arguments = [];
  await deploy("Beer4Crypto", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
    /* adjust if ProviderError: transaction underpriced */
    //gasPrice: ethers.utils.parseUnits("200", "gwei"),
    //gasLimit: 30000000,
  });

  log("---------------------------------");
  log(`Beer4Crypto deployed with owner : ${deployer}`);

  const beer4crypto = await ethers.getContract("Beer4Crypto", deployer);

  /***********************************
   *
   *  rify the deployment
   *
   ************************************/
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(beer4crypto.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "beer4crypto"];
