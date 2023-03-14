const { ethers } = require("hardhat");

async function main() {
    [alice] = await ethers.getSigners();


    const paramsConstractorMainnet = {
        weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        reservoir: "0x178A86D36D89c7FDeBeA90b739605da7B131ff6A",
        seaportModule: "0x20794EF7693441799a3f38FCC22a12b3E04b9572",
        looksRareModule: "0x385df8CBC196f5f780367F3cDC96aF072a916F7E",
        x2y2Module: "0x613D3c588F6B8f89302b463F8F19f7241B2857E2",
        sudoswap: "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329",
        ezswap: "0xa63eC144d070a1BF19a7577C88c580E7de92E0fc",
    };


    const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgrade");


    let ProxyAddress = "0x6afb4Bb77e6770f0584CB83AeA5e6E57EEe346C6" 


    const eza2 = await upgrades.upgradeProxy(ProxyAddress, EZA, {
        constructorArgs: [paramsConstractorMainnet]
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
