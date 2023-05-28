import { ethers } from "ethers"

export const truncatedAmount = (amount, tokenDecimals = 18, formatDecimals = 2) => {
  if (!amount) {
    return 0
  }
  const formatedAmount = ethers.utils.formatUnits(amount.toString(), tokenDecimals)
  return Math.round(formatedAmount * 10 ** formatDecimals) / 10 ** formatDecimals
}

export const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(Number(date)).toLocaleDateString("en-US", options)
}

export const formatAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4)
}
