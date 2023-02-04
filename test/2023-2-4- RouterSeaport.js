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


    let apiDatas = [{
        "id": "0x867e120e2c1957af1133eab35d268420c6619afaa836f30234d4fa0249c6182f",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:26789",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
        "maker": "0x53eae709d6866178e9cc38d6e7d7ea80885038ec",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                "name": "USD Coin (PoS)",
                "symbol": "USDC",
                "decimals": 6
            },
            "amount": {
                "raw": "45300000",
                "decimal": 45.3,
                "usd": 45.31155,
                "native": 38.2321
            },
            "netAmount": {
                "raw": "44167500",
                "decimal": 44.1675,
                "usd": 44.17876,
                "native": 37.27629
            }
        },
        "validFrom": 1674183112,
        "validUntil": 1676861512,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "26789"
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
        "expiration": 1676861512,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-01-20T02:54:57.895Z",
        "updatedAt": "2023-01-20T02:54:57.895Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000280b51fbbccf916e",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "26789"
                }
            ],
            "counter": "0",
            "endTime": 1676861512,
            "offerer": "0x53eae709d6866178e9cc38d6e7d7ea80885038ec",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0x48ab6272b774086ed3596e7ab349c12ac8ad418c3b87592ca219fed0b02419f82a26e0c031b9cbb9289b380b2040177cb1e50717ae47c4673052747a9f379ef21c",
            "startTime": 1674183112,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "44167500",
                    "recipient": "0x53eae709d6866178e9cc38d6e7d7ea80885038ec",
                    "startAmount": "44167500",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "1132500",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "1132500",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    }, {
        "id": "0x0a75a4edc294ab555ec80134fcfe22cd8eb42fee6d6f1bca10d413f2c6eadca8",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0xdb46d1dc155634fbc732f92e853b10b288ad5a1d:94798",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
        "maker": "0xd9a20c518856266e10b0a7919e9f2e737257efbb",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                "name": "USD Coin (PoS)",
                "symbol": "USDC",
                "decimals": 6
            },
            "amount": {
                "raw": "50000000",
                "decimal": 50,
                "usd": 50.01275,
                "native": 42.19878
            },
            "netAmount": {
                "raw": "48750000",
                "decimal": 48.75,
                "usd": 48.76243,
                "native": 41.14381
            }
        },
        "validFrom": 1674150651,
        "validUntil": 1676724964,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "94798"
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
        "expiration": 1676724964,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-01-19T17:50:53.790Z",
        "updatedAt": "2023-01-19T17:50:53.790Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe00000000000000000000000000000000000000004c2f1661464cd123",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "94798"
                }
            ],
            "counter": "0",
            "endTime": 1676724964,
            "offerer": "0xd9a20c518856266e10b0a7919e9f2e737257efbb",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0x4beeb230c2ba363378e62516d3c64667181f0847c408e5a612f3f5db97fb4eb914760fdf435fb14285bf11fc24a844481b3cdca0598226145150227bc5074fed1b",
            "startTime": 1674150651,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "48750000",
                    "recipient": "0xd9a20c518856266e10b0a7919e9f2e737257efbb",
                    "startAmount": "48750000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                    "itemType": 1,
                    "endAmount": "1250000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "1250000",
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
            seaportModule: "0xb75Dfff7dA2A0c8E6Bb235b80d28f997152D06FC", // SeaportModule 
            ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
            seaport: "0x00000000006c3852cbEf3e08E8dF289169EdE581"  // seaport
        };

        sr = await (
            await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
        ).deploy(paramsConstractorMatic);


    });

    it("reservior ERC20 buy", async () => {


        console.log("router address:", sr.address)
        console.log(await usdc.balanceOf(alice._address))


        ///////////////////// 1 approve
        await usdc.approve(sr.address, ethers.constants.MaxUint256)


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

        console.log(await nft.balanceOf(alice._address))
        console.log(await usdc.balanceOf(alice._address))

    });
});
