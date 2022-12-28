async function main() {

  [alice] = await ethers.getSigners();

  const paramsConstractorGoerli = {
    weth9: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", //
    reservoir: "0xb35D22a4553Ab9d2b85e2A606CBAe55F844DF50c", //
    seaportModule: "",
    looksRareModule: "",
    x2y2Module: "",
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
