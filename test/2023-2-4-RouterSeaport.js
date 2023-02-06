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
    let nftAddress = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"  // lens


    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'


    // let apiDatas = [{
    //     "id": "0x867e120e2c1957af1133eab35d268420c6619afaa836f30234d4fa0249c6182f",
    //     "kind": "seaport",
    //     "side": "sell",
    //     "status": "active",
    //     "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:26789",
    //     "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //     "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    //     "maker": "0x53eae709d6866178e9cc38d6e7d7ea80885038ec",
    //     "taker": "0x0000000000000000000000000000000000000000",
    //     "price": {
    //         "currency": {
    //             "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //             "name": "USD Coin (PoS)",
    //             "symbol": "USDC",
    //             "decimals": 6
    //         },
    //         "amount": {
    //             "raw": "45300000",
    //             "decimal": 45.3,
    //             "usd": 45.31155,
    //             "native": 38.2321
    //         },
    //         "netAmount": {
    //             "raw": "44167500",
    //             "decimal": 44.1675,
    //             "usd": 44.17876,
    //             "native": 37.27629
    //         }
    //     },
    //     "validFrom": 1674183112,
    //     "validUntil": 1676861512,
    //     "quantityFilled": 0,
    //     "quantityRemaining": 1,
    //     "criteria": {
    //         "kind": "token",
    //         "data": {
    //             "token": {
    //                 "tokenId": "26789"
    //             }
    //         }
    //     },
    //     "source": {
    //         "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
    //         "domain": "opensea.io",
    //         "name": "OpenSea",
    //         "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
    //     },
    //     "feeBps": 250,
    //     "feeBreakdown": [
    //         {
    //             "bps": 250,
    //             "kind": "marketplace",
    //             "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
    //         }
    //     ],
    //     "expiration": 1676861512,
    //     "isReservoir": null,
    //     "isDynamic": false,
    //     "createdAt": "2023-01-20T02:54:57.895Z",
    //     "updatedAt": "2023-01-20T02:54:57.895Z",
    //     "rawData": {
    //         "kind": "single-token",
    //         "salt": "0x360c6ebe0000000000000000000000000000000000000000280b51fbbccf916e",
    //         "zone": "0x0000000000000000000000000000000000000000",
    //         "offer": [
    //             {
    //                 "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    //                 "itemType": 2,
    //                 "endAmount": "1",
    //                 "startAmount": "1",
    //                 "identifierOrCriteria": "26789"
    //             }
    //         ],
    //         "counter": "0",
    //         "endTime": 1676861512,
    //         "offerer": "0x53eae709d6866178e9cc38d6e7d7ea80885038ec",
    //         "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //         "orderType": 0,
    //         "signature": "0x48ab6272b774086ed3596e7ab349c12ac8ad418c3b87592ca219fed0b02419f82a26e0c031b9cbb9289b380b2040177cb1e50717ae47c4673052747a9f379ef21c",
    //         "startTime": 1674183112,
    //         "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    //         "consideration": [
    //             {
    //                 "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //                 "itemType": 1,
    //                 "endAmount": "44167500",
    //                 "recipient": "0x53eae709d6866178e9cc38d6e7d7ea80885038ec",
    //                 "startAmount": "44167500",
    //                 "identifierOrCriteria": "0"
    //             },
    //             {
    //                 "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //                 "itemType": 1,
    //                 "endAmount": "1132500",
    //                 "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
    //                 "startAmount": "1132500",
    //                 "identifierOrCriteria": "0"
    //             }
    //         ]
    //     }
    // }, {
    //     "id": "0x0a75a4edc294ab555ec80134fcfe22cd8eb42fee6d6f1bca10d413f2c6eadca8",
    //     "kind": "seaport",
    //     "side": "sell",
    //     "status": "active",
    //     "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:94798",
    //     "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //     "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    //     "maker": "0xd9a20c518856266e10b0a7919e9f2e737257efbb",
    //     "taker": "0x0000000000000000000000000000000000000000",
    //     "price": {
    //         "currency": {
    //             "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //             "name": "USD Coin (PoS)",
    //             "symbol": "USDC",
    //             "decimals": 6
    //         },
    //         "amount": {
    //             "raw": "50000000",
    //             "decimal": 50,
    //             "usd": 50.01275,
    //             "native": 42.19878
    //         },
    //         "netAmount": {
    //             "raw": "48750000",
    //             "decimal": 48.75,
    //             "usd": 48.76243,
    //             "native": 41.14381
    //         }
    //     },
    //     "validFrom": 1674150651,
    //     "validUntil": 1676724964,
    //     "quantityFilled": 0,
    //     "quantityRemaining": 1,
    //     "criteria": {
    //         "kind": "token",
    //         "data": {
    //             "token": {
    //                 "tokenId": "94798"
    //             }
    //         }
    //     },
    //     "source": {
    //         "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
    //         "domain": "opensea.io",
    //         "name": "OpenSea",
    //         "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
    //     },
    //     "feeBps": 250,
    //     "feeBreakdown": [
    //         {
    //             "bps": 250,
    //             "kind": "marketplace",
    //             "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
    //         }
    //     ],
    //     "expiration": 1676724964,
    //     "isReservoir": null,
    //     "isDynamic": false,
    //     "createdAt": "2023-01-19T17:50:53.790Z",
    //     "updatedAt": "2023-01-19T17:50:53.790Z",
    //     "rawData": {
    //         "kind": "single-token",
    //         "salt": "0x360c6ebe00000000000000000000000000000000000000004c2f1661464cd123",
    //         "zone": "0x0000000000000000000000000000000000000000",
    //         "offer": [
    //             {
    //                 "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    //                 "itemType": 2,
    //                 "endAmount": "1",
    //                 "startAmount": "1",
    //                 "identifierOrCriteria": "94798"
    //             }
    //         ],
    //         "counter": "0",
    //         "endTime": 1676724964,
    //         "offerer": "0xd9a20c518856266e10b0a7919e9f2e737257efbb",
    //         "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //         "orderType": 0,
    //         "signature": "0x4beeb230c2ba363378e62516d3c64667181f0847c408e5a612f3f5db97fb4eb914760fdf435fb14285bf11fc24a844481b3cdca0598226145150227bc5074fed1b",
    //         "startTime": 1674150651,
    //         "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    //         "consideration": [
    //             {
    //                 "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //                 "itemType": 1,
    //                 "endAmount": "48750000",
    //                 "recipient": "0xd9a20c518856266e10b0a7919e9f2e737257efbb",
    //                 "startAmount": "48750000",
    //                 "identifierOrCriteria": "0"
    //             },
    //             {
    //                 "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //                 "itemType": 1,
    //                 "endAmount": "1250000",
    //                 "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
    //                 "startAmount": "1250000",
    //                 "identifierOrCriteria": "0"
    //             }
    //         ]
    //     }
    // }, {
    //     "id": "0x0e803337237b28e3550c312c8b5e46866aa264b243dd4d74eefa9e966812b58e",
    //     "kind": "seaport",
    //     "side": "sell",
    //     "status": "active",
    //     "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:60119",
    //     "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //     "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    //     "maker": "0xa0edbfc449fb674dd4e8b722546005d4ff29a781",
    //     "taker": "0x0000000000000000000000000000000000000000",
    //     "price": {
    //         "currency": {
    //             "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //             "name": "USD Coin (PoS)",
    //             "symbol": "USDC",
    //             "decimals": 6
    //         },
    //         "amount": {
    //             "raw": "130000000",
    //             "decimal": 130,
    //             "usd": 130.29302,
    //             "native": 109.71683
    //         },
    //         "netAmount": {
    //             "raw": "126750000",
    //             "decimal": 126.75,
    //             "usd": 127.03569,
    //             "native": 106.97391
    //         }
    //     },
    //     "validFrom": 1675428412,
    //     "validUntil": 1676744120,
    //     "quantityFilled": 0,
    //     "quantityRemaining": 1,
    //     "criteria": {
    //         "kind": "token",
    //         "data": {
    //             "token": {
    //                 "tokenId": "60119"
    //             }
    //         }
    //     },
    //     "source": {
    //         "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
    //         "domain": "opensea.io",
    //         "name": "OpenSea",
    //         "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
    //     },
    //     "feeBps": 250,
    //     "feeBreakdown": [
    //         {
    //             "bps": 250,
    //             "kind": "marketplace",
    //             "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
    //         }
    //     ],
    //     "expiration": 1676744120,
    //     "isReservoir": null,
    //     "isDynamic": false,
    //     "createdAt": "2023-02-03T12:47:06.834Z",
    //     "updatedAt": "2023-02-03T12:47:06.834Z",
    //     "rawData": {
    //         "kind": "single-token",
    //         "salt": "0x360c6ebe0000000000000000000000000000000000000000a27b09ccabb047c6",
    //         "zone": "0x0000000000000000000000000000000000000000",
    //         "offer": [
    //             {
    //                 "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    //                 "itemType": 2,
    //                 "endAmount": "1",
    //                 "startAmount": "1",
    //                 "identifierOrCriteria": "60119"
    //             }
    //         ],
    //         "counter": "0",
    //         "endTime": 1676744120,
    //         "offerer": "0xa0edbfc449fb674dd4e8b722546005d4ff29a781",
    //         "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //         "orderType": 0,
    //         "signature": "0x23677cd6bf19aee4def160e835ca6e32d41a227fa58eff7b784a1f457d0512d447df63f4efd53ebcdffe6fa051dd47a544d6c8c26de79b994d8c48515395190c1c",
    //         "startTime": 1675428412,
    //         "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    //         "consideration": [
    //             {
    //                 "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //                 "itemType": 1,
    //                 "endAmount": "126750000",
    //                 "recipient": "0xa0edbfc449fb674dd4e8b722546005d4ff29a781",
    //                 "startAmount": "126750000",
    //                 "identifierOrCriteria": "0"
    //             },
    //             {
    //                 "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //                 "itemType": 1,
    //                 "endAmount": "3250000",
    //                 "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
    //                 "startAmount": "3250000",
    //                 "identifierOrCriteria": "0"
    //             }
    //         ]
    //     }
    // }]

    let apiDatas = [{
        "id": "0x87a1c4bd30e8aceda8e2ac3bce011386e11009c41d5da2eacfd211fe6a55e37a",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:46092",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
        "maker": "0xa69e27c4caa3481500ca0d220b1abf4fbcf45034",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                "name": "USD Coin (PoS)",
                "symbol": "USDC",
                "decimals": 6
            },
            "amount": {
                "raw": "181000000",
                "decimal": 181,
                "usd": 181.04615,
                "native": 145.1373
            },
            "netAmount": {
                "raw": "176475000",
                "decimal": 176.475,
                "usd": 176.52,
                "native": 141.50887
            }
        },
        "validFrom": 1675522865,
        "validUntil": 1675583108,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "46092"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
        },
        "feeBps": 250,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            }
        ],
        "expiration": 1675583108,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-04T15:01:08.823Z",
        "updatedAt": "2023-02-04T15:01:08.823Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000a5bd61642a8ee361",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "46092"
                }
            ],
            "counter": "0",
            "endTime": 1675583108,
            "offerer": "0xa69e27c4caa3481500ca0d220b1abf4fbcf45034",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0xf2bdf861da1e8e64de908dc197a86f7e6b8ff1b5f77c7c17158341b0990aa34e51f949719ec40134387874a967b6589f661bd84fb5fe82877c7593aff6aecf551b",
            "startTime": 1675522865,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "176475000",
                    "recipient": "0xa69e27c4caa3481500ca0d220b1abf4fbcf45034",
                    "startAmount": "176475000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "4525000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "4525000",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    },
    {
        "id": "0x1c8f80a61b99d514131ddc2fef9b08ccf5492cf7dd24738d45e37d40a68f6f53",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:109427",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
        "maker": "0x032c1d4296a43a36986fc87d89c806531148b617",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                "name": "Wrapped Ether",
                "symbol": "WETH",
                "decimals": 18
            },
            "amount": {
                "raw": "44000000000000000",
                "decimal": 0.044,
                "usd": 73.24842,
                "native": 58.72026
            },
            "netAmount": {
                "raw": "42900000000000000",
                "decimal": 0.0429,
                "usd": 71.41721,
                "native": 57.25225
            }
        },
        "validFrom": 1675522739,
        "validUntil": 1677941939,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "109427"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
        },
        "feeBps": 250,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            }
        ],
        "expiration": 1677941939,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-04T15:01:08.109Z",
        "updatedAt": "2023-02-04T15:01:08.109Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000b51284645549562f",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "109427"
                }
            ],
            "counter": "0",
            "endTime": 1677941939,
            "offerer": "0x032c1d4296a43a36986fc87d89c806531148b617",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0xbde6efb437ef0a88287926140cbb8f3bc739527f2e2eb6d9676c3d009799aa024afafa6869dbbb6557fc9aa1b63c5ccfe637c95a8d90e8932180dc75ffe0df891b",
            "startTime": 1675522739,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                    "itemType": 1,
                    "endAmount": "42900000000000000",
                    "recipient": "0x032c1d4296a43a36986fc87d89c806531148b617",
                    "startAmount": "42900000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                    "itemType": 1,
                    "endAmount": "1100000000000000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "1100000000000000",
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

        nft = new ethers.Contract(nftAddress, nft721ABI, alice);

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
        console.log("before execute usdc balance is:",await usdc.balanceOf(alice._address))


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
            let orderParams = [
                apiData.rawData.consideration[0].token,
                apiData.rawData.consideration[0].identifierOrCriteria,
                apiData.rawData.consideration[0].endAmount,
                apiData.rawData.offerer,
                apiData.rawData.zone,
                apiData.rawData.offer[0].token,
                apiData.rawData.offer[0].identifierOrCriteria,
                apiData.rawData.offer[0].endAmount,
                8,  // apiData.rawData.orderType  
                apiData.rawData.startTime,
                apiData.rawData.endTime,
                apiData.rawData.zoneHash,
                apiData.rawData.salt,
                apiData.rawData.conduitKey,
                '0x0000000000000000000000000000000000000000000000000000000000000000',      // apiData.rawData.conduitKey  '0x0000000000000000000000000000000000000000000000000000000000000000'
                apiData.rawData.consideration.length - 1,
                additonalRecipients,
                apiData.rawData.signature
            ]

            let inputdata = seaportInterface.encodeFunctionData("fulfillBasicOrder", [orderParams])
            // console.log(inputdata)

            // let tx = await seaport.fulfillBasicOrder(orderParams)


            const SeaportList = {
                tokenAddress: apiData.price.currency.contract,
                tokenValue: apiData.price.amount.raw,
                inputDate: inputdata,
                nftStandard: 721,   // ???
                nftAddress: apiData.tokenSetId.split(":")[1],
                nftTokenId: apiData.tokenSetId.split(":")[2],
                nftAmount: apiData.quantityRemaining  // ???
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

        // await alice.sendTransaction({
        //     to: seaport.address,
        //     data: '0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e7ddb0000000000000000000000000d9a20c518856266e10b0a7919e9f2e737257efbb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db46d1dc155634fbc732f92e853b10b288ad5a1d000000000000000000000000000000000000000000000000000000000001724e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000063c982fb0000000000000000000000000000000000000000000000000000000063f0cae40000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000004c2f1661464cd1230000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000001312d00000000000000000000000000000a26b00c1f0df003000390027140000faa71900000000000000000000000000000000000000000000000000000000000000414beeb230c2ba363378e62516d3c64667181f0847c408e5a612f3f5db97fb4eb914760fdf435fb14285bf11fc24a844481b3cdca0598226145150227bc5074fed1b00000000000000000000000000000000000000000000000000000000000000'
        // })

        // let tx = await seaport.fulfillBasicOrder(orderParams)


        console.log("after execute nft balance is:",await nft.balanceOf(alice._address))
        console.log("after execute usdc balance is:",await usdc.balanceOf(alice._address))

    });
});
