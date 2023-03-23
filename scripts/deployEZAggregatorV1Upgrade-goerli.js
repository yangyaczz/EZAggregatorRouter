const { ethers, upgrades } = require("hardhat");

async function main() {

  const paramsConstractorGoerli = {
    weth9: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", //
    reservoir: "0xb35D22a4553Ab9d2b85e2A606CBAe55F844DF50c", //
    seaportModule: "0x6C460f133c573C21e7f55900D0C68F6F085B91e7",
    looksRareModule: "0x532486Bb46581b032134159C1D31962cdab1E6a7",
    x2y2Module: "0x6A789513b2E555f9d3539bf9A053A57D2BFCa426",
    sudoswap: "0x25b4EfC43c9dCAe134233CD577fFca7CfAd6748F", //
    ezswap: "0xDc589E5D0260eDf624bc7a8c8543a31473B6B519", //
  };

  const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgrade");
  let sr = await upgrades.deployProxy(EZA, [], {
    constructorArgs: [paramsConstractorGoerli],
  });

  await sr.deployed();

  console.log("upgrade contract address is:", sr.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
