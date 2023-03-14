const { ethers } = require("hardhat");


async function main() {
    // await hre.run("verify:verify", {
    //     address: "0x30cf9343194129956f84f92254f3242bf350ca32",
    //     constructorArguments: [
    //         {
    //             weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //             reservoir: "0x178A86D36D89c7FDeBeA90b739605da7B131ff6A",
    //             seaportModule: "0x20794EF7693441799a3f38FCC22a12b3E04b9572",
    //             looksRareModule: "0x385df8CBC196f5f780367F3cDC96aF072a916F7E",
    //             x2y2Module: "0x613D3c588F6B8f89302b463F8F19f7241B2857E2",
    //             sudoswap: "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329",
    //             ezswap: "0xa63eC144d070a1BF19a7577C88c580E7de92E0fc",
    //         }
    //     ],
    // });

    await hre.run("verify:verify", {
        address: "0x9721166dd73C876D752C8203513eaDD80DFeA66e",
        constructorArguments: [
            {
                weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  
                seaportModule: "0xe225aFD0B78a265a60CCaEB1c1310e0016716E7B", 
                ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", 
                seaport: "0x00000000000001ad428e4906aE43D8F9852d0dD6" 
            }
        ],
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});