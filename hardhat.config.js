require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */    



const forkingUrl = process.env.forkingUrl;
const goerliUrl = process.env.goerliUrl
const goerliAccount = process.env.goerliAccount

module.exports = {
  solidity: "0.8.17",

  networks: {
    hardhat: {
      chainId: 1,
      forking:{
        url: forkingUrl,
        blockNumber: 16246090,    // 16246090 buy // 16232197 sell
      }
    },

    goerli: {
      url: goerliUrl,
      // accounts: [goerliAccount]
    },
  }
};
