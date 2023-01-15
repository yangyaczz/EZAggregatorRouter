const { ethers } = require("hardhat");

async function main() {
  [alice] = await ethers.getSigners();

  const paramsConstractorMatic = {
    weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
    reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
    seaportModule: "0xb75Dfff7dA2A0c8E6Bb235b80d28f997152D06FC", // SeaportModule 
    ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
  };


  const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic");


  const eza = await upgrades.deployProxy(EZA, [], {
    constructorArgs: [paramsConstractorMatic],
  });

  await eza.deployed();

  console.log("contract address is:", eza.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
