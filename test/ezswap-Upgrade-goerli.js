const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");
const hre = require('hardhat')
const nftABI = require("./abis/ERC1155.json");
const ezswapABI = require("./abis/ezswap.json");
const srABI = require("../artifacts/contracts/EZAggregatorV1Upgrade/EZAggregatorV1RouterUpgrade.sol/EZAggregatorV1RouterUpgrade.json");

describe("aggregator buy nft test", function () {
  let alice;
  let nft;
  let srAddress = "0x458AB744e4557331c0921AF2aBfaf37FD92c68e7";
  let sr;
  let DEADLINE = 2000000000;
  let ezswapInterface;
  let provider;
  let buySigner;
  const nftAddress = "0x8CDF8bcb344DAeC3D2DBEE23e78AFA65Ac5D20c0";
  const buyPoolAddress = "0x0790bFA7A64fc0c46250C08D999bBB6BC0E19d3e";
  const sellPoolAddress = "0x6DA5564028E361F45184b343AE86A1794B2bCD18";
  beforeEach(async () => {

    ezswapInterface = new ethers.utils.Interface(ezswapABI);


    provider = new ethers.providers.JsonRpcProvider(process.env.goerliUrl);
    buySigner = new ethers.Wallet(process.env.goerliBuy, provider);
    nft = new ethers.Contract(nftAddress, nftABI).connect(buySigner);

    sr = new ethers.Contract(srAddress, srABI.abi).connect(buySigner);

    //////////////////////
  });

  it("buy nft through router", async () => {
    
    console.log(
      "before execute taker nft balance:",
      await nft.balanceOf(buySigner.address, 2),
      "before execute pool nft balance:",
      await nft.balanceOf(buyPoolAddress, 2),
      await nft.balanceOf("0x342E697899E050c24b176F7D1114181Bc03f2dCf", 2)
    );
    /////
    const maxCost = hre.ethers.utils.parseEther("0.06");
    const calldata = ezswapInterface.encodeFunctionData(
      "robustSwapETHForSpecificNFTs",
      [
        [[["0x31B2Ea2fB85A317479F71F8ff0d327633f21Ab86", [2], [3]], maxCost]],
        buySigner.address,
        buySigner.address,
        DEADLINE,
      ]
    );
    let inputs = [];
    inputs.push(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "bytes"],
        [maxCost, calldata]
      )
    );

    const receipt = await (
      await sr["execute(bytes,bytes[],uint256)"]("0x0a", inputs, DEADLINE, {
        value: maxCost
      })
    ).wait();

    console.log(
      "before execute taker nft balance:",
      await nft.balanceOf(buySigner.address, 2),
      "before execute pool nft balance:",
      await nft.balanceOf(buyPoolAddress, 2),
      await nft.balanceOf("0x342E697899E050c24b176F7D1114181Bc03f2dCf", 2)
    );
  });

  it.skip("sell nft through router", async () => {
    await nft.setApprovalForAll(sr.address, true);

    /////////////////// 1 sell nft
    // calucate input bytes
    const calldataSell = ezswapInterface.encodeFunctionData(
      "robustSwapNFTsForToken",
      [
        [[[sellPoolAddress, [1], [3]], 0]], // need to change
        buySigner.address, // need to change
        DEADLINE, // need to change
      ]
    );


    const encoudeStructSudoSell = [
      "bytes",
      "address",
      "(address collection,uint256[] tokenIds,uint256 tokenStandards,uint256[] tokenAmounts)[]",
    ];
    const encodeDataSudoSell = [
      calldataSell,
      buySigner.address,
      [{ collection: nft.address, tokenIds: [1], tokenStandards: 1155, tokenAmounts: [3]}],
    ]; // need to change
    const input = ethers.utils.defaultAbiCoder.encode(
      encoudeStructSudoSell,
      encodeDataSudoSell
    );
    console.log(
      "before execute taker nft balance:",
      await nft.balanceOf(buySigner.address, 1),
      "before execute pool nft balance:",
      await nft.balanceOf(sellPoolAddress, 1),
    );
    const receipt = await (
      await sr["execute(bytes,bytes[],uint256)"]("0x0b", [input], DEADLINE)
    ).wait();

    console.log(
      "before execute taker nft balance:",
      await nft.balanceOf(buySigner.address, 1),
      "before execute pool nft balance:",
      await nft.balanceOf(sellPoolAddress, 1),
    );
  });
});
