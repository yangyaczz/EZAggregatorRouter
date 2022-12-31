require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-tracer");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */    

const { setGlobalDispatcher, ProxyAgent } = require('undici')
const proxyAgent = new ProxyAgent('http://127.0.0.1:7890')
setGlobalDispatcher(proxyAgent)


const forkingUrl = process.env.forkingUrl;
const goerliUrl = process.env.goerliUrl
const goerliAccount = process.env.goerliAccount
const etherscanApiKey = process.env.etherscanApiKey
module.exports = {

  // compilers: [
  //   {
  //     version: "0.8.17"
  //   },
  //   {
  //     version: "0.8.9"
  //   }
  // ],
  solidity: "0.8.17",

  networks: {
    hardhat: {
      chainId: 1,
      forking:{
        url: forkingUrl,  // forkingUrl
        blockNumber: 16232197,    // mainnet-- 16246090 buy  16232197 sell   //  goerli 8221940 sell
      }
    },

    goerli: {
      url: goerliUrl,
      accounts: [goerliAccount]
    },
  },

  etherscan: {
    apiKey: etherscanApiKey
  }
};
