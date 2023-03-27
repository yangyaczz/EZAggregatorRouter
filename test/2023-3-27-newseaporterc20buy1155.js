const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nft721ABI = require("./abis/ERC721.json");
const nft1155ABI = require("./abis/ERC1155.json");
const wethABI = require("./abis/WETH.json")

const seaportABI = require("./abis/Seaport.json")

describe("aggregator matic buy advance order", function () {
  let alice;
  let nft;
  let sr;
  let weth

  let blocknumber = 40340100
  let mockAddress = "0x69734444A9c9954c21D83B5F062802909dC5112B";  //  whale
  let nftAddress = "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3"  // moca

  let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
  let seaportAddress = "0x00000000000001ad428e4906aE43D8F9852d0dD6"
  let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'


  let postDatas = [{
    "steps": [
      {
        "id": "currency-approval",
        "action": "Approve exchange contract",
        "description": "A one-time setup transaction to enable trading",
        "kind": "transaction",
        "items": [
          {
            "status": "incomplete",
            "data": {
              "from": "0x59e0b0c67a8f14be8c5855c95cdd2ba95a7f2bbb",
              "to": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
              "data": "0x095ea7b30000000000000000000000001e0049783f008a0085193e00003d00cd54003c71ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            }
          }
        ]
      },
      {
        "id": "permit",
        "action": "Sign permits",
        "description": "Sign permits for accessing the tokens in your wallet",
        "kind": "signature",
        "items": []
      },
      {
        "id": "sale",
        "action": "Confirm transaction in your wallet",
        "description": "To purchase this item you must confirm the transaction and pay the gas fee",
        "kind": "transaction",
        "items": [
          {
            "status": "incomplete",
            "orderIds": [
              "0x2a128e01ff65259db6ac21386fc0301dbfb0ed5a1ad83b04a80b0099f350cb29"
            ],
            "data": {
              "from": "0x59e0b0c67a8f14be8c5855c95cdd2ba95a7f2bbb",
              "to": "0x00000000000001ad428e4906ae43d8f9852d0dd6",
              "data": "0xe7acab24000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000005600000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000054d987558d16bee9b4f94d422dd8363bf626e3f7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000642152b600000000000000000000000000000000000000000000000000000000642a8d360000000000000000000000000000000000000000000000000000000000000000360c6ebe0000000000000000000000000000000000000000349931380edd845e0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000005c76677fea2bf5dd37e4f1460968a23a537e3ee3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002396b7c0000000000000000000000000000000000000000000000000000000002396b7c000000000000000000000000054d987558d16bee9b4f94d422dd8363bf626e3f700000000000000000000000000000000000000000000000000000000000000010000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003183c800000000000000000000000000000000000000000000000000000000003183c80000000000000000000000000a1640edd7b69a3bdf98cd9a6a61f663dcf6d2aa200000000000000000000000000000000000000000000000000000000000000405d48f73708718497b23cf9965efeae6af7787e56740e132136d3c7ecf86d4ae24c19731735ff90d6c5f4a4797b1bbc7c6ecfc055ddb7e20e01455eebcfdcfd0b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    ],
    "path": [
      {
        "orderId": "0x2a128e01ff65259db6ac21386fc0301dbfb0ed5a1ad83b04a80b0099f350cb29",
        "contract": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "tokenId": "0",
        "quantity": 1,
        "source": "opensea.io",
        "currency": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        "quote": 6.49,
        "rawQuote": "6490000"
      }
    ]
  }]

  beforeEach(async () => {

    // await network.provider.request({
    //     method: "hardhat_reset",
    //     params: [
    //         {
    //             chainId: 137,
    //             forking: {
    //                 jsonRpcUrl: "https://1rpc.io/matic",
    //                 blockNumber: blocknumber,
    //             },
    //         },
    //     ],
    // });


    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [mockAddress],
    });
    alice = await ethers.provider.getSigner(mockAddress);

    nft = new ethers.Contract(nftAddress, nft1155ABI, alice);   //

    weth = new ethers.Contract(wethAddress, wethABI, alice)
    usdc = new ethers.Contract(usdcAddress, wethABI, alice)
    seaport = new ethers.Contract(seaportAddress, seaportABI, alice)

    seaportInterface = new ethers.utils.Interface(seaportABI)


    const paramsConstractorMatic = {
      weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
      reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
      seaportModule: "0xe225aFD0B78a265a60CCaEB1c1310e0016716E7B", // SeaportModule 
      ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
      seaport: "0x00000000000001ad428e4906aE43D8F9852d0dD6", // seaport
      ezswapV2: "0x183Eb45a05EA5456A6D329bb76eA6C6DABb375a6"   //  ezswapv2

    };

    sr = await (
      await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
    ).deploy(paramsConstractorMatic);


  });

  it("router  buy", async () => {



    console.log("router address:", sr.address)
    console.log("before execute nft balance is:", await nft.balanceOf(alice._address, 0))
    console.log("before execute weth balance is:", await weth.balanceOf(alice._address))


    ///////////////////// 1 approve
    await usdc.approve(sr.address, ethers.constants.MaxUint256)
    await usdc.approve(seaport.address, ethers.constants.MaxUint256)

    await weth.approve(sr.address, ethers.constants.MaxUint256)
    await weth.approve(seaport.address, ethers.constants.MaxUint256)




    ///////////////////// 2 encode date
    let SeaportLists = [];
    let totalValue = ethers.BigNumber.from('0');
    for (let i = 0; i < postDatas.length; i++) {

      let stepslength = postDatas[i].steps.length

      if (postDatas[i].steps[stepslength - 1].items[0].data.to != seaportAddress.toLowerCase()) {
        continue
      }

      let inputdata = postDatas[i].steps[stepslength - 1].items[0].data.data

      if (postDatas[i].path[0].currency == "0x0000000000000000000000000000000000000000") {
        let value = ethers.BigNumber.from(postDatas[i].path[0].rawQuote)
        totalValue = totalValue.add(value)
      }


      const SeaportList = {
        tokenAddress: postDatas[i].path[0].currency,
        tokenValue: postDatas[i].path[0].rawQuote,
        inputDate: inputdata,
        nftStandard: 1155,   // identify from outside
        nftAddress: postDatas[i].path[0].contract,
        nftTokenId: postDatas[i].path[0].tokenId,
        nftAmount: postDatas[i].path[0].quantity
      };

      SeaportLists.push(SeaportList);
    }


    // process.exit() 
    ///////////////////////////////   3  send tx
    let input = ethers.utils.defaultAbiCoder.encode(
      [
        "(address tokenAddress, uint256 tokenValue, bytes inputDate, uint256 nftStandard, address nftAddress, uint256 nftTokenId, uint256 nftAmount)[]",
      ],
      [SeaportLists]
    );

    await sr.connect(alice)['execute(bytes,bytes[],uint256)']('0x10', [input], 2000000000, { value: totalValue });


    console.log("after execute nft balance is:", await nft.balanceOf(alice._address, 0))
    console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

  });
});
