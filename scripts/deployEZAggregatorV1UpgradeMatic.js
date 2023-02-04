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

  /// upgrade


  // await upgrades.forceImport("0x30cf9343194129956f84f92254f3242bf350ca32", EZA, {
  //   constructorArgs: [paramsConstractorMainnet],
  // })


  ///

  // let ProxyAddress = "0x0B1877395d5b4F93A677cB13544b0061Ee45e8A3"


  // await upgrades.forceImport(ProxyAddress, EZA, {
  //   constructorArgs: [paramsConstractorMainnet],
  // })

  // const eza2 = await upgrades.upgradeProxy(ProxyAddress, EZA, {
  //   constructorArgs: [paramsConstractorMatic]
  // })

  // await eza2.deployed();

  // console.log("upgrade contract address is:", eza2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
