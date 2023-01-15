const { ethers } = require("hardhat"); 

async function main() {
  [alice] = await ethers.getSigners();

  // alice = await ethers.getSigner()

  const paramsConstractorMainnet = {
    weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    reservoir: "0x178A86D36D89c7FDeBeA90b739605da7B131ff6A",
    seaportModule: "0x3729014ef28f01B3ddCF7f980D925E0B71b1F847",
    looksRareModule: "0x385df8CBC196f5f780367F3cDC96aF072a916F7E",
    x2y2Module: "0x613D3c588F6B8f89302b463F8F19f7241B2857E2",
    sudoswap: "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329",
    ezswap: "0xa63eC144d070a1BF19a7577C88c580E7de92E0fc",
  };

  const paramsConstractorGoerli = {
    weth9: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", //
    reservoir: "0xb35D22a4553Ab9d2b85e2A606CBAe55F844DF50c", //
    seaportModule: "0x6C460f133c573C21e7f55900D0C68F6F085B91e7",
    looksRareModule: "0x532486Bb46581b032134159C1D31962cdab1E6a7",
    x2y2Module: "0x6A789513b2E555f9d3539bf9A053A57D2BFCa426",
    sudoswap: "0x25b4EfC43c9dCAe134233CD577fFca7CfAd6748F", //
    ezswap: "0x826868A09FECAb872E8E95bc02ff040223C950FE", //
  };

  sr = await (
    await ethers.getContractFactory("EZAggregatorV1Router")
  ).deploy(paramsConstractorGoerli);

  console.log("contract address is:", sr.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
