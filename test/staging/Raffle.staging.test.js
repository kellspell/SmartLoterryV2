const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers, getChainId } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Test", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })
          describe("FulfillRandomWords", function () {
              it("Works with live Chainlink Keepers and Chainlink VRF, we get a random Winner", async function () {
                  // Enter the raffle
                  const startingTimaeStamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      raffle.one("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")

                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toSting(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimaeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(e)
                          }
                      })
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      const winnerStartingBalance = await accounts[0].getBalance
                  })
              })
          })

          // The way to test our Staging test is ..
          // 1. Get our SubId for Chainlink VRF
          // 2. Deploy our contract using the SubId
          // 3. Register the contract with Chainlink VRF & its's subId
          // 4. Register the contract with Chainlink Keepers
          // 5. Run stating test
          // 6. My Subscriptions ID 22278
      })
