const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nft721ABI = require("./abis/ERC721.json");
const nft1155ABI = require("./abis/ERC1155.json");
const wethABI = require("./abis/WETH.json")

const seaportABI = require("./abis/Seaport.json")

describe("aggregator matic buy erc20 nft test", function () {
    let alice;
    let nft;
    let sr;
    let weth


    let blocknumber = 16548382
    let mockAddress = "0x176F3DAb24a159341c0509bB36B833E7fdd0a132";  //  whale
    let nftAddress = "0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e"  // gbl
    // let tokenid = 7
    // let nftTokenId = "0x5d9cc2b3aefdbe8ec0f69361248e27bfb6c06202:6"

    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'


    let apiData = {
        "id": "0x4fb1978d0660ea4a01250c74dadcb1eb6bfa9af21ffed9cf16dac7e830689858",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e:3835",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
        "maker": "0x59256a269c99728ca84b6ef88e6da2a4f294697c",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x0000000000000000000000000000000000000000",
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "amount": {
                "raw": "1553800000000000000",
                "decimal": 1.5538,
                "usd": 2561.71849,
                "native": 1.5538
            },
            "netAmount": {
                "raw": "1398420000000000000",
                "decimal": 1.39842,
                "usd": 2305.54664,
                "native": 1.39842
            }
        },
        "validFrom": 1675435103,
        "validUntil": 1675469765,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "3835"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
            "url": "https://opensea.io/assets/0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e/3835"
        },
        "feeBps": 1000,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            },
            {
                "bps": 750,
                "kind": "royalty",
                "recipient": "0xe382357719828bb01c6116d564aba0b15f2ac89e"
            }
        ],
        "expiration": 1675469765,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-03T14:38:29.959Z",
        "updatedAt": "2023-02-03T14:38:29.959Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000c9632d13ea5b2449",
            "zone": "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
            "offer": [
                {
                    "token": "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "3835"
                }
            ],
            "counter": "6",
            "endTime": 1675469765,
            "offerer": "0x59256a269c99728ca84b6ef88e6da2a4f294697c",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 2,
            "signature": "0x3785ad0b1f12ce152ee7ae00c629736de6c15ad348f1ac79406361644dd8aeb306a984a3662c47c70fd089f35c27145a42eba1f35f816ca5225e6b932b25dc5f1c",
            "startTime": 1675435103,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "1398420000000000000",
                    "recipient": "0x59256a269c99728ca84b6ef88e6da2a4f294697c",
                    "startAmount": "1398420000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "38845000000000000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "38845000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "116535000000000000",
                    "recipient": "0xe382357719828bb01c6116d564aba0b15f2ac89e",
                    "startAmount": "116535000000000000",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    }

    beforeEach(async () => {

        // await network.provider.request({
        //     method: "hardhat_reset",
        //     params: [
        //         {
        //             chainId: 1,
        //             forking: {
        //                 // jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/b5Av64vYI2CowvlC4ezAAyDrbdNQ0rPx",
        //                 jsonRpcUrl: "https://rpc.ankr.com/eth",
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

        nft = new ethers.Contract(nftAddress, nft721ABI, alice);

        weth = new ethers.Contract(wethAddress, wethABI, alice)
        seaport = new ethers.Contract(seaportAddress, seaportABI, alice)
        usdc = new ethers.Contract(usdcAddress, wethABI, alice)

        seaportInterface = new ethers.utils.Interface(seaportABI)



        // const paramsConstractorMatic = {
        //     weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
        //     reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
        //     seaportModule: "0xb75Dfff7dA2A0c8E6Bb235b80d28f997152D06FC", // SeaportModule 
        //     ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
        //     seaport: "0x00000000006c3852cbEf3e08E8dF289169EdE581"  // seaport
        // };

        // sr = await (
        //     await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
        // ).deploy(paramsConstractorMatic);



        // const SR = await ethers.getContractFactory("EZAggregatorV1Router")
        // sr = await SR.attach("0x0B1877395d5b4F93A677cB13544b0061Ee45e8A3")

        //////////////////////
    });

    it("reservior ERC20 buy", async () => {

        // console.log(sr.address)
        console.log(await ethers.provider.getBlockNumber())

        // console.log(
        //     "taker address is:",
        //     alice._address,
        //     "relayer address is:",
        //     sr.address
        // );

        // console.log(
        //     "before execute taker nft balance:",
        //     await nft.balanceOf(alice._address, tokenid),
        //     "before execute relayer nft balance:",
        //     await nft.balanceOf(sr.address, tokenid)
        // );

        // console.log(await weth.balanceOf(alice._address))
        console.log(await ethers.provider.getBalance(alice._address))

        // await weth.approve("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619")



        // await alice.sendTransaction({
        //     to: "0x00000000006c3852cbef3e08e8df289169ede581",
        //     data: "0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013682f94b2cd400000000000000000000000000059256a269c99728ca84b6ef88e6da2a4f294697c000000000000000000000000004c00500000ad104d7dbd00e3ae0a5c00560c00000000000000000000000000bce3781ae7ca1a5e050bd9c4c77369867ebc307e0000000000000000000000000000000000000000000000000000000000000efb000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000063dd1c5f0000000000000000000000000000000000000000000000000000000063dda3c50000000000000000000000000000000000000000000000000000000000000000360c6ebe0000000000000000000000000000000000000000c9632d13ea5b24490000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000008a01525a4cd0000000000000000000000000000000a26b00c1f0df003000390027140000faa719000000000000000000000000000000000000000000000000019e03f70ee67000000000000000000000000000e382357719828bb01c6116d564aba0b15f2ac89e00000000000000000000000000000000000000000000000000000000000000413785ad0b1f12ce152ee7ae00c629736de6c15ad348f1ac79406361644dd8aeb306a984a3662c47c70fd089f35c27145a42eba1f35f816ca5225e6b932b25dc5f1c00000000000000000000000000000000000000000000000000000000000000",
       //     value: '0x159034de1c008000'
        // })


        // get additonalRecipients
        let additonalRecipients = []
        for (let i = 1; i < apiData.rawData.consideration.length; i++) {
            let aR = [
                apiData.rawData.consideration[i].endAmount,
                apiData.rawData.consideration[i].recipient
            ]
            additonalRecipients.push(aR)
        }


        // sort params from api
        let orderParams = [
            apiData.rawData.consideration[0].token,
            apiData.rawData.consideration[0].identifierOrCriteria,
            apiData.rawData.consideration[0].endAmount,
            apiData.rawData.offerer,
            apiData.rawData.zone,
            apiData.rawData.offer[0].token,
            apiData.rawData.offer[0].identifierOrCriteria,
            apiData.rawData.offer[0].endAmount,
            apiData.rawData.orderType,
            apiData.rawData.startTime,
            apiData.rawData.endTime,
            apiData.rawData.zoneHash,
            apiData.rawData.salt,   // apiData.rawData.salt
            apiData.rawData.conduitKey,
            apiData.rawData.conduitKey,
            apiData.rawData.consideration.length - 1,
            additonalRecipients,
            apiData.rawData.signature
        ]

        // send tx
        // let tx = await seaport.fulfillBasicOrder(orderParams, { value: '0x159034de1c008000' })

        let inputdata = seaportInterface.encodeFunctionData("fulfillBasicOrder", [orderParams])

        // console.log(inputdata)

        await alice.sendTransaction({
            to: seaport.address,
            data: inputdata,
            value: '0x159034de1c008000'
        })

        console.log(await nft.balanceOf(alice._address))




    });
});
