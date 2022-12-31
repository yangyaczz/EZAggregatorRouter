const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nftABI = require("./abis/ERC721.json");
const sudoABI = require("./abis/Sudoswap.json");

describe("aggregator buy nft test", function () {
  let alice;
  let nft;
  let sr;
  let DEADLINE = 2000000000;
  let sudointerface;

  beforeEach(async () => {
    [alice] = await ethers.getSigners();

    sudointerface = new ethers.utils.Interface(sudoABI);

    const nftAddress = "0xfa9937555dc20a020a161232de4d2b109c62aa9c";
    nft = new ethers.Contract(nftAddress, nftABI, alice);

    const paramsConstractorMainnet = {
      weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      reservoir: "0x178A86D36D89c7FDeBeA90b739605da7B131ff6A",
      seaportModule: "0x3729014ef28f01B3ddCF7f980D925E0B71b1F847",
      looksRareModule: "0x385df8CBC196f5f780367F3cDC96aF072a916F7E",
      x2y2Module: "0x613D3c588F6B8f89302b463F8F19f7241B2857E2",
      sudoswap: "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329",
      ezswap: "0xa63eC144d070a1BF19a7577C88c580E7de92E0fc",
    };

    // sr = await (
    //   await ethers.getContractFactory("EZAggregatorV1Router")
    // ).deploy(paramsConstractorMainnet);

    const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgrade");

    sr = await upgrades.deployProxy(EZA, [paramsConstractorMainnet], {
      initializer: "initialize",
    });

    await sr.deployed();





    //////////////////////
  });

  it("buy nft through router", async () => {
    console.log(
      "taker address is:",
      alice.address,
      "relayer address is:",
      sr.address
    );

    console.log(
      "before execute taker nft balance:",
      await nft.balanceOf(alice.address),
      "before execute pool nft balance:",
      await nft.balanceOf("0x339e7004372e04b1d59443f0ddc075efd9d80360")
    );
    /////

    const value = BigNumber.from("73337152777777783");
    const calldata = sudointerface.encodeFunctionData(
      "robustSwapETHForSpecificNFTs",
      [
        [
          [
            ["0x339e7004372e04b1d59443f0ddc075efd9d80360", ["80"]],
            "73337152777777783",
          ],
        ],
        alice.address,
        alice.address,
        DEADLINE,
      ]
    );

    let inputs = [];
    inputs.push(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "bytes"],
        [value, calldata]
      )
    );

    let commands = "0x";
    let type = 0x08;
    commands = commands.concat(type.toString(16).padStart(2, "0"));

    const receipt = await (
      await sr["execute(bytes,bytes[],uint256)"](commands, inputs, DEADLINE, {
        value: value,
      })
    ).wait();

    console.log(
      "after execute taker nft balance:",
      await nft.balanceOf(alice.address),
      "after execute pool nft balance:",
      await nft.balanceOf("0x339e7004372e04b1d59443f0ddc075efd9d80360")
    );
  });

  it("sell nft through router", async () => {

    await nft.setApprovalForAll(sr.address, true);

    /////////////////// 1 sell nft
    // calucate input bytes
    const calldataSell = sudointerface.encodeFunctionData(
      "robustSwapNFTsForToken",
      [
        [[["0x339e7004372e04b1d59443f0ddc075efd9d80360", ["80"]], "1000000"]], // need to change
        sr.address, // need to change
        DEADLINE, // need to change
      ]
    );


    const encoudeStructSudoSell = [
      "bytes",
      "address",
      "(address collection,uint256[] tokenIds,uint256 tokenStandards)[]",
    ];
    const encodeDataSudoSell = [
      calldataSell,
      alice.address,
      [{ collection: nft.address, tokenIds: [80], tokenStandards: 721 }],
    ]; // need to change
    const input = ethers.utils.defaultAbiCoder.encode(
      encoudeStructSudoSell,
      encodeDataSudoSell
    );

    /////////////////// 2 sweep eth

    // calucate eth amount
    const routerPayMinAmount = BigNumber.from("0");

    // calucate input bytes
    const encoudeStructSweep = ["address", "address", "uint256"];
    const encodeDataSweep = [
      ethers.constants.AddressZero,
      alice.address,
      routerPayMinAmount,
    ];
    const inputs2 = ethers.utils.defaultAbiCoder.encode(
      encoudeStructSweep,
      encodeDataSweep
    );


    const receipt = await (
      await sr["execute(bytes,bytes[],uint256)"](0x0904, [input, inputs2], DEADLINE)
    ).wait();

    console.log(
      "after execute sell taker nft balance:",
      await nft.balanceOf(alice.address),
      "after execute sell pool nft balance:",
      await nft.balanceOf("0x339e7004372e04b1d59443f0ddc075efd9d80360")
    );
  });
});
