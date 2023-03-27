const { ethers } = require("hardhat");

async function main() {
    [alice] = await ethers.getSigners();


    const paramsConstractorMatic = {
        weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
        reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
        seaportModule: "0xe225aFD0B78a265a60CCaEB1c1310e0016716E7B", // SeaportModule 
        ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
        seaport: "0x00000000000001ad428e4906aE43D8F9852d0dD6",  // seaport
        ezswapV2: "0x812520f9dfbDB4BC34a80546c0F1fd3e7904839E"           // test: 0x183Eb45a05EA5456A6D329bb76eA6C6DABb375a6
    };


    const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic");


    let ProxyAddress = "0xaAD133aAb27ae56f07faccEc342a551C324F1Ef0"

    // await upgrades.forceImport(ProxyAddress, EZA, {
    //   constructorArgs: [paramsConstractorMainnet],
    // })

    const eza2 = await upgrades.upgradeProxy(ProxyAddress, EZA, {
      constructorArgs: [paramsConstractorMatic]
    })

    await eza2.deployed();

    console.log("upgrade contract address is:", eza2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
