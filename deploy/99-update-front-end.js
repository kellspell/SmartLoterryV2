const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../nextjs-smartlottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartlottery/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end")
        updateContractAddresses()
        updateAbi()
    }
    async function updateAbi() {
        const raffle = await ethers.getContract("Raffle")
        fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
    }
    async function updateContractAddresses() {
        const raffle = await ethers.getContract("Raffle")
        const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
        if (network.config.chainId.toString() in contractAddresses) {
            if (!contractAddresses[network.config.chainId.toString()].includes(raffle.address)) {
                contractAddresses[network.config.chainId.toString()].push(raffle.address)
            }
        } else {
            contractAddresses[network.config.chainId.toString()] = [raffle.address]
        }
        fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddresses))
    }
}

module.exports.tags = ["all", "frontend"]

// Do not Forget before run our code in order to get the ABI and conctract address 
// We need to create our json file in our front end project and leave {} blank curlir brakets in each file 
