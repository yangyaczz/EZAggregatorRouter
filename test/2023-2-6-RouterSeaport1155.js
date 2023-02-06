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


    let blocknumber = 38892764
    let mockAddress = "0xc71c590eF9a4f4ebc5DF1c6A555dEeD3F8E721f5";  //  whale
    let nftAddress = "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3"  //   1155


    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'



    let apiDatas = [{
        "id": "0xb8f32ce5433b9cd5e60d6eac7c4efa9aa99b7d554d2ec2d98789395d2ec9f241",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3:0",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "maker": "0x776f18639fe867971472e715af49856011918fe1",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                "name": "USD Coin (PoS)",
                "symbol": "USDC",
                "decimals": 6
            },
            "amount": {
                "raw": "42000000",
                "decimal": 42,
                "usd": 41.99345,
                "native": 33.67827
            },
            "netAmount": {
                "raw": "37590000",
                "decimal": 37.59,
                "usd": 37.58414,
                "native": 30.14205
            }
        },
        "validFrom": 1675655899,
        "validUntil": 1678075099,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "0"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
        },
        "feeBps": 1050,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            },
            {
                "bps": 800,
                "kind": "royalty",
                "recipient": "0xa1640edd7b69a3bdf98cd9a6a61f663dcf6d2aa2"
            }
        ],
        "expiration": 1678075099,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-06T04:01:01.751Z",
        "updatedAt": "2023-02-06T04:01:01.751Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe00000000000000000000000000000000000000007fdea2082965001b",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
                    "itemType": 3,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "0"
                }
            ],
            "counter": "0",
            "endTime": 1678075099,
            "offerer": "0x776f18639fe867971472e715af49856011918fe1",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 1,
            "signature": "0x89ad37bc8707906f4972de29a84fba47c469566e183ba7f8e4ba1b5c9b68181231d7af3b2118c7fb082df9e0964ccfa4696dfa6381739fd2fe0267872862fc3b1b",
            "startTime": 1675655899,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "37590000",
                    "recipient": "0x776f18639fe867971472e715af49856011918fe1",
                    "startAmount": "37590000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "1050000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "1050000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "3360000",
                    "recipient": "0xa1640edd7b69a3bdf98cd9a6a61f663dcf6d2aa2",
                    "startAmount": "3360000",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    },
    {
        "id": "0xe4428d08c921b7960962390670f8914f61edb44266eef434bf902e95435d1caf",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3:0",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "maker": "0x016f60fe3d6c528864790b941171a6c6dd36499f",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                "name": "USD Coin (PoS)",
                "symbol": "USDC",
                "decimals": 6
            },
            "amount": {
                "raw": "6980000",
                "decimal": 6.98,
                "usd": 6.97891,
                "native": 5.59701
            },
            "netAmount": {
                "raw": "6247100",
                "decimal": 6.2471,
                "usd": 6.24613,
                "native": 5.00932
            }
        },
        "validFrom": 1675654694,
        "validUntil": 1675741094,
        "quantityFilled": 0,
        "quantityRemaining": 6,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "0"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
        },
        "feeBps": 1050,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            },
            {
                "bps": 800,
                "kind": "royalty",
                "recipient": "0xa1640edd7b69a3bdf98cd9a6a61f663dcf6d2aa2"
            }
        ],
        "expiration": 1675741094,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-06T03:40:55.037Z",
        "updatedAt": "2023-02-06T03:40:55.037Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000b9623d71999fb5f3",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
                    "itemType": 3,
                    "endAmount": "6",
                    "startAmount": "6",
                    "identifierOrCriteria": "0"
                }
            ],
            "counter": "0",
            "endTime": 1675741094,
            "offerer": "0x016f60fe3d6c528864790b941171a6c6dd36499f",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 1,
            "signature": "0x6cb71d98ef04d58e6e0b5b9d90a2d5cc8814796fc5dba2b2f6020069353cbf6930c990ddb21d0a6ca6c7903f3fa856b0d6af98c070fea6898fe85553d67960761b",
            "startTime": 1675654694,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "37482600",
                    "recipient": "0x016f60fe3d6c528864790b941171a6c6dd36499f",
                    "startAmount": "37482600",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "1047000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "1047000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "3350400",
                    "recipient": "0xa1640edd7b69a3bdf98cd9a6a61f663dcf6d2aa2",
                    "startAmount": "3350400",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    }]

    beforeEach(async () => {

        // await network.provider.request({
        //     method: "hardhat_reset",
        //     params: [
        //         {
        //             chainId: 137,
        //             forking: {
        //                 jsonRpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/VKUc1_zI9zmEaXNsiDNY0KynQE6rKMsp",
        //                 // jsonRpcUrl: "https://rpc.ankr.com/polygon",
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

        nft = new ethers.Contract(nftAddress, nft1155ABI, alice);

        weth = new ethers.Contract(wethAddress, wethABI, alice)
        usdc = new ethers.Contract(usdcAddress, wethABI, alice)
        seaport = new ethers.Contract(seaportAddress, seaportABI, alice)

        seaportInterface = new ethers.utils.Interface(seaportABI)


        const paramsConstractorMatic = {
            weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
            reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
            seaportModule: "0xe225aFD0B78a265a60CCaEB1c1310e0016716E7B", // SeaportModule 
            ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
            seaport: "0x00000000006c3852cbEf3e08E8dF289169EdE581"  // seaport
        };

        sr = await (
            await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
        ).deploy(paramsConstractorMatic);


    });

    it("reservior ERC20 buy", async () => {


        console.log("router address:", sr.address)
        console.log("before execute nft balance is:", await nft.balanceOf(alice._address, 0))
        console.log("before execute usdc balance is:", await usdc.balanceOf(alice._address))


        ///////////////////// 1 approve
        await usdc.approve(sr.address, ethers.constants.MaxUint256)
        await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        await weth.approve(sr.address, ethers.constants.MaxUint256)
        await weth.approve(seaport.address, ethers.constants.MaxUint256)



        ///////////////////// 2 encode date
        let SeaportLists = [];
        for (let i = 0; i < apiDatas.length; i++) {

            let apiData = apiDatas[i]

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
            const parameters = {
                "offerer": apiData.rawData.offerer,
                "offer": apiData.rawData.offer,
                "consideration": apiData.rawData.consideration,
                "startTime": apiData.rawData.startTime,
                "endTime": apiData.rawData.endTime,
                "orderType": apiData.rawData.orderType,
                "zone": apiData.rawData.zone,
                "zoneHash": apiData.rawData.zoneHash,
                "salt": apiData.rawData.salt,
                "conduitKey": apiData.rawData.conduitKey,
                "totalOriginalConsiderationItems": apiData.rawData.consideration.length,
                "counter": apiData.rawData.counter
            }



            const advancedOrder = {
                parameters: parameters,
                numerator: ethers.BigNumber.from('1'),  // number of buy
                denominator: ethers.BigNumber.from(apiData.rawData.offer[0].endAmount),
                signature: apiData.rawData.signature,
                extraData: '0x00',
            }

            // let txAdvanced = await seaport.fulfillAdvancedOrder(
            //     advancedOrder,
            //     [],
            //     '0x0000000000000000000000000000000000000000000000000000000000000000',
            //     sr.address
            // )

            let inputdata = seaportInterface.encodeFunctionData("fulfillAdvancedOrder", [
                advancedOrder,
                [],
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                sr.address
            ])


            const SeaportList = {
                tokenAddress: apiData.price.currency.contract,
                tokenValue: apiData.price.amount.raw,
                inputDate: inputdata,
                nftStandard: 1155,   // identify from outside
                nftAddress: apiData.tokenSetId.split(":")[1],
                nftTokenId: apiData.tokenSetId.split(":")[2],
                nftAmount: 1  //  number of buy
            };

            SeaportLists.push(SeaportList);
            // console.log(SeaportList)
        }

        ///////////////////////////////   3  send tx
        let input = ethers.utils.defaultAbiCoder.encode(
            [
                "(address tokenAddress, uint256 tokenValue, bytes inputDate, uint256 nftStandard, address nftAddress, uint256 nftTokenId, uint256 nftAmount)[]",
            ],
            [SeaportLists]
        );

        await sr.connect(alice)['execute(bytes,bytes[],uint256)']('0x10', [input], 2000000000);


        console.log("after execute nft balance is:", await nft.balanceOf(alice._address, 0))
        console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

    });
});
