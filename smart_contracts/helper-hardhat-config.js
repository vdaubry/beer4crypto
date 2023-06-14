const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
  },
  5: {
    name: "goerli",
    ethUsdPriceFeddAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  1: {
    name: "mainnet",
  },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 // 2000 * 10 ** DECIMALS = 2000 USD

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  DECIMALS,
  INITIAL_ANSWER,
}
