const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nft721ABI = require("./abis/ERC721.json");
const nft1155ABI = require("./abis/ERC1155.json");
const wethABI = require("./abis/WETH.json")

const seaportABI = require("./abis/Seaport.json")

describe("aggregator matic buy native token nft test", function () {
    let alice;
    let nft;
    let sr;
    let weth


    let blocknumber = 38892764
    let mockAddress = "0xc71c590eF9a4f4ebc5DF1c6A555dEeD3F8E721f5";  //  whale
    let nftAddress = "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf"  // ufo

    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'




    let apiDatas = [{
        "id": "0x156c90fb0a1df93f4f42375727193315ffd64462b89e8461467eeb700910f223",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0x6b7134df79f3babf83584ea6219ffd4cb2747bbf:580",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf",
        "maker": "0x44c0b8ceed591b877a1a20b51ed8b390ad0ef51a",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x0000000000000000000000000000000000000000",
                "name": "Matic Token",
                "symbol": "MATIC",
                "decimals": 18
            },
            "amount": {
                "raw": "990000000000000000",
                "decimal": 0.99,
                "usd": 1.23494,
                "native": 0.99
            },
            "netAmount": {
                "raw": "866250000000000000",
                "decimal": 0.86625,
                "usd": 1.08057,
                "native": 0.86625
            }
        },
        "validFrom": 1675600930,
        "validUntil": 1678020130,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "580"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
        },
        "feeBps": 1250,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            },
            {
                "bps": 1000,
                "kind": "royalty",
                "recipient": "0x4df17f9977a174214b247f0625ef8ca3bdc3a640"
            }
        ],
        "expiration": 1678020130,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-05T12:47:09.669Z",
        "updatedAt": "2023-02-05T12:47:09.669Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000df4d1f812b42809f",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "580"
                }
            ],
            "counter": "0",
            "endTime": 1678020130,
            "offerer": "0x44c0b8ceed591b877a1a20b51ed8b390ad0ef51a",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0x590e1551b83511340243902c713e860dc1cf22bcaf19140585ee88650a7878a307ffb1029e97aafc4011602d030f5f87a25d283d7e54cd65ed2b74412493c8c41c",
            "startTime": 1675600930,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "866250000000000000",
                    "recipient": "0x44c0b8ceed591b877a1a20b51ed8b390ad0ef51a",
                    "startAmount": "866250000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "24750000000000000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "24750000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "99000000000000000",
                    "recipient": "0x4df17f9977a174214b247f0625ef8ca3bdc3a640",
                    "startAmount": "99000000000000000",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    }, {
        "id": "0x19f8064b8d77d23aab643c89913334bafb7ded9cda37b7a7fcf0ad53de632cac",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0x6b7134df79f3babf83584ea6219ffd4cb2747bbf:760",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf",
        "maker": "0x44c0b8ceed591b877a1a20b51ed8b390ad0ef51a",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x0000000000000000000000000000000000000000",
                "name": "Matic Token",
                "symbol": "MATIC",
                "decimals": 18
            },
            "amount": {
                "raw": "990000000000000000",
                "decimal": 0.99,
                "usd": 1.23494,
                "native": 0.99
            },
            "netAmount": {
                "raw": "866250000000000000",
                "decimal": 0.86625,
                "usd": 1.08057,
                "native": 0.86625
            }
        },
        "validFrom": 1675600930,
        "validUntil": 1678020130,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "760"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg"
        },
        "feeBps": 1250,
        "feeBreakdown": [
            {
                "bps": 250,
                "kind": "marketplace",
                "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
            },
            {
                "bps": 1000,
                "kind": "royalty",
                "recipient": "0x4df17f9977a174214b247f0625ef8ca3bdc3a640"
            }
        ],
        "expiration": 1678020130,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-02-05T12:46:53.402Z",
        "updatedAt": "2023-02-05T12:46:53.402Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000510c7b954c12f3ab",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "760"
                }
            ],
            "counter": "0",
            "endTime": 1678020130,
            "offerer": "0x44c0b8ceed591b877a1a20b51ed8b390ad0ef51a",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0xb185134b4526d32e43f4ec6de6d8816fc24c08efb5ea83956d402c1b1f50830a12129510b745cdddd07dd95be740f3c019a1ee3005ad098ffb6f2abf3b5b88731b",
            "startTime": 1675600930,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "866250000000000000",
                    "recipient": "0x44c0b8ceed591b877a1a20b51ed8b390ad0ef51a",
                    "startAmount": "866250000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "24750000000000000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "24750000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "99000000000000000",
                    "recipient": "0x4df17f9977a174214b247f0625ef8ca3bdc3a640",
                    "startAmount": "99000000000000000",
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

    it("reservior native token buy", async () => {


        console.log("router address:", sr.address)
        // console.log("before execute usdc balance is:", await usdc.balanceOf(alice._address))


        ///////////////////// 1 approve
        // await usdc.approve(sr.address, ethers.constants.MaxUint256)
        // await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        // await weth.approve(sr.address, ethers.constants.MaxUint256)
        // await weth.approve(seaport.address, ethers.constants.MaxUint256)



        ///////////////////// 2 encode date
        let SeaportLists = [];
        let TotalValue = ethers.BigNumber.from("0")
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
                0,  // apiData.rawData.orderType  
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

            TotalValue = TotalValue.add(ethers.BigNumber.from(apiData.price.amount.raw))

            // let tx = await seaport.fulfillBasicOrder(orderParams, {value: apiData.price.amount.raw})


            const SeaportList = {
                tokenAddress: apiData.price.currency.contract,
                tokenValue: apiData.price.amount.raw,
                inputDate: inputdata,
                nftStandard: 721,   // ???
                nftAddress: apiData.tokenSetId.split(":")[1],
                nftTokenId: apiData.tokenSetId.split(":")[2],
                nftAmount: 1  // ??? apiData.quantityRemaining
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

        // console.log(input)

        await sr.connect(alice)['execute(bytes,bytes[],uint256)']('0x10', [input], 2000000000, { value: TotalValue });

        // await alice.sendTransaction({
        //     to: seaport.address,
        //     data: '0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e7ddb0000000000000000000000000d9a20c518856266e10b0a7919e9f2e737257efbb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db46d1dc155634fbc732f92e853b10b288ad5a1d000000000000000000000000000000000000000000000000000000000001724e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000063c982fb0000000000000000000000000000000000000000000000000000000063f0cae40000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000004c2f1661464cd1230000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000001312d00000000000000000000000000000a26b00c1f0df003000390027140000faa71900000000000000000000000000000000000000000000000000000000000000414beeb230c2ba363378e62516d3c64667181f0847c408e5a612f3f5db97fb4eb914760fdf435fb14285bf11fc24a844481b3cdca0598226145150227bc5074fed1b00000000000000000000000000000000000000000000000000000000000000'
        // })
        // let tx = await seaport.fulfillBasicOrder(orderParams)


        console.log("after execute nft balance is:", await nft.balanceOf(alice._address))
        // console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

    });
});
