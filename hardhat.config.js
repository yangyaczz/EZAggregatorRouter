require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-tracer");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */    

const { setGlobalDispatcher, ProxyAgent } = require('undici')
const proxyAgent = new ProxyAgent('https://127.0.0.1:7890')
setGlobalDispatcher(proxyAgent)


const forkingUrl = process.env.forkingUrl;
const goerliUrl = process.env.goerliUrl
const goerliAccount = process.env.goerliAccount

const maticUrl = process.env.maticUrl
const maticAccount = process.env.maticAccount
const maticAccount2 = process.env.maticAccount2


const mainnetUrl = process.env.mainnetUrl
const mainnetAccount = process.env.mainnetAccount


const etherscanApiKey = process.env.etherscanApiKey
const maticscanApiKey = process.env.maticscanApiKey



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

  mocha: {
    timeout: 100000000000000000000000
  },

  networks: {


    // hardhat: {
    //   chainId: 1,
    //   forking:{
    //     url: forkingUrl,  // forkingUrl
    //     blockNumber: 16548923,    // mainnet-- 16246090 buy  16232197 sell   //  goerli 8221940 sell   // 16341230 sell mulit  // sell jlx 16355510
    //   }
    // },

    hardhat: {
      chainId: 137,
      forking:{
        // url: "https://polygon-mainnet.g.alchemy.com/v2/VKUc1_zI9zmEaXNsiDNY0KynQE6rKMsp",  // matic
        // url :"https://rpc.ankr.com/polygon",
        url: "https://1rpc.io/matic",
        blockNumber: 39005278,   // 38905500
      }
    },

    goerli: {
      url: goerliUrl,
      accounts: [goerliAccount] 
    },

    matic: {
      // url: maticUrl,
      url :"https://rpc.ankr.com/polygon",
      accounts: [maticAccount2]
    },

    mainnet: {
      url : mainnetUrl,
      accounts: [mainnetAccount]
    }

  },

  etherscan: {
    apiKey: maticscanApiKey
  }
};
