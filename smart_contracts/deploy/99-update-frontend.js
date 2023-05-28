const util = require("util")
const exec = util.promisify(require("child_process").exec)
const fs = require("fs")
const path = require("path")
const { network, ethers } = require("hardhat")

const frontendAddressesFile = "../frontend/constants/contract_addresses.json"
const frontendContractAbiFile = "../frontend/constants/contract_abi.json"
const graphContractAbiFile = "../graph/abis/Beer4Crypto.json"

module.exports = async (hre) => {
    await updateAddresses()
    await updateAbi()
}

const updateAddresses = async () => {
    const beer4crypto = await ethers.getContract("Beer4Crypto")
    const adresses = JSON.parse(fs.readFileSync(frontendAddressesFile, "utf8"))
    const chainId = network.config.chainId

    adresses[chainId] = {
        contract: beer4crypto.address,
    }

    fs.writeFileSync(frontendAddressesFile, JSON.stringify(adresses))
}

const updateAbi = async () => {
    const contractPath = path.resolve(__dirname, "../contracts/Beer4Crypto.sol")
    const abisDir = path.resolve(__dirname, "../abis")

    // compile the contract with solcjs, output files to the contract's directory
    const { stdout, stderr } = await exec(`solcjs --abi ${contractPath} --output-dir ${abisDir}`)

    // check for any errors during compilation
    if (stderr) {
        console.error("Error during compilation:", stderr)
        return
    }

    console.log(stdout)

    // read the generated ABI
    const abiFile = path.resolve(abisDir, "contracts_Beer4Crypto_sol_Beer4Crypto.abi")
    const abi = JSON.parse(fs.readFileSync(abiFile, "utf8"))

    fs.writeFileSync(frontendContractAbiFile, JSON.stringify(abi, null, 2))
    fs.writeFileSync(graphContractAbiFile, JSON.stringify(abi, null, 2))
}

module.exports.tags = ["all", "frontend"]
