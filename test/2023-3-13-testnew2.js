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


    let blocknumber = 40296887
    let mockAddress = "0x2726601eae74e5d8e0e3ab50d49800cae7b6571b";  //  whale
    let nftAddress = "0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d"  // payc

    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000000001ad428e4906aE43D8F9852d0dD6"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'



    let apiDatas = [{
        "id": "0x99669c4973830fce9323e178999f8afff58e0134ca883835cbe6ec8e77d2124a",
        "kind": "seaport-v1.4",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d:4222",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d",
        "maker": "0xf0a62ef9fe1e74eba4c8c944e03f7d64b44723cb",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x0000000000000000000000000000000000000000",
                "name": "Matic Token",
                "symbol": "MATIC",
                "decimals": 18
            },
            "amount": {
                "raw": "138000000000000000000",
                "decimal": 138,
                "usd": 159.19625,
                "native": 138
            },
            "netAmount": {
                "raw": "131100000000000000000",
                "decimal": 131.1,
                "usd": 151.23644,
                "native": 131.1
            }
        },
        "validFrom": 1678707975,
        "validUntil": 1678967175,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "4222"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
            "url": "https://opensea.io/assets/matic/0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d/4222"
        },
        "feeBps": 500,
        "feeBreakdown": [
            {
                "bps": 500,
                "kind": "royalty",
                "recipient": "0x77272c168b92ed84764ede7e18fb416e524cc444"
            }
        ],
        "expiration": 1678967175,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-03-13T11:48:22.610Z",
        "updatedAt": "2023-03-13T11:48:22.610Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000586eeabac331f264",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "4222"
                }
            ],
            "counter": "0",
            "endTime": 1678967175,
            "offerer": "0xf0a62ef9fe1e74eba4c8c944e03f7d64b44723cb",
            "partial": true,
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0x3603578d3ca4cb9bf5c6de2dd39c963a517184119b82b81866f943d168adb1f5e66fcfda6c3848c2072bf8a21b26c26a0a55bd89f6dd9f343023bc79dc25741c0000027ff2db70fca5efc2cec3ff8842090bcb89db7b7d77652addbad80061a5093751a61ef4b80a409bfe82c563a56250f22bc2d442592b51972912ed2ebca31dac45",
            "startTime": 1678707975,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "131100000000000000000",
                    "recipient": "0xf0a62ef9fe1e74eba4c8c944e03f7d64b44723cb",
                    "startAmount": "131100000000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "6900000000000000000",
                    "recipient": "0x77272c168b92ed84764ede7e18fb416e524cc444",
                    "startAmount": "6900000000000000000",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    }]

    let apiData = {
        "id": "0x99669c4973830fce9323e178999f8afff58e0134ca883835cbe6ec8e77d2124a",
        "kind": "seaport-v1.4",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d:4222",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d",
        "maker": "0xf0a62ef9fe1e74eba4c8c944e03f7d64b44723cb",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x0000000000000000000000000000000000000000",
                "name": "Matic Token",
                "symbol": "MATIC",
                "decimals": 18
            },
            "amount": {
                "raw": "138000000000000000000",
                "decimal": 138,
                "usd": 159.19625,
                "native": 138
            },
            "netAmount": {
                "raw": "131100000000000000000",
                "decimal": 131.1,
                "usd": 151.23644,
                "native": 131.1
            }
        },
        "validFrom": 1678707975,
        "validUntil": 1678967175,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "4222"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
            "url": "https://opensea.io/assets/matic/0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d/4222"
        },
        "feeBps": 500,
        "feeBreakdown": [
            {
                "bps": 500,
                "kind": "royalty",
                "recipient": "0x77272c168b92ed84764ede7e18fb416e524cc444"
            }
        ],
        "expiration": 1678967175,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-03-13T11:48:22.610Z",
        "updatedAt": "2023-03-13T11:48:22.610Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000586eeabac331f264",
            "zone": "0x0000000000000000000000000000000000000000",
            "offer": [
                {
                    "token": "0x419e82d502f598ca63d821d3bbd8dfefaf9bbc8d",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "4222"
                }
            ],
            "counter": "0",
            "endTime": 1678967175,
            "offerer": "0xf0a62ef9fe1e74eba4c8c944e03f7d64b44723cb",
            "partial": true,
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 0,
            "signature": "0x3603578d3ca4cb9bf5c6de2dd39c963a517184119b82b81866f943d168adb1f5e66fcfda6c3848c2072bf8a21b26c26a0a55bd89f6dd9f343023bc79dc25741c0000027ff2db70fca5efc2cec3ff8842090bcb89db7b7d77652addbad80061a5093751a61ef4b80a409bfe82c563a56250f22bc2d442592b51972912ed2ebca31dac45",
            "startTime": 1678707975,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "131100000000000000000",
                    "recipient": "0xf0a62ef9fe1e74eba4c8c944e03f7d64b44723cb",
                    "startAmount": "131100000000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "6900000000000000000",
                    "recipient": "0x77272c168b92ed84764ede7e18fb416e524cc444",
                    "startAmount": "6900000000000000000",
                    "identifierOrCriteria": "0"
                }
            ]
        }
    }

    beforeEach(async () => {

        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    chainId: 137,
                    forking: {
                        jsonRpcUrl: "https://1rpc.io/matic",
                        blockNumber: blocknumber,
                    },
                },
            ],
        });


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
            seaport: "0x00000000000001ad428e4906aE43D8F9852d0dD6"  // seaport
        };

        sr = await (
            await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
        ).deploy(paramsConstractorMatic);


    });

    it("router  buy", async () => {

        ///////////////////// 1 approve
        await usdc.approve(sr.address, ethers.constants.MaxUint256)
        await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        await weth.approve(sr.address, ethers.constants.MaxUint256)
        await weth.approve(seaport.address, ethers.constants.MaxUint256)


        console.log("router address:", sr.address)
        console.log("before execute nft balance is:", await nft.balanceOf(alice._address))
        console.log("before execute weth balance is:", await weth.balanceOf(alice._address))


        ///////////////////// 1 approve
        await usdc.approve(sr.address, ethers.constants.MaxUint256)
        await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        await weth.approve(sr.address, ethers.constants.MaxUint256)
        await weth.approve(seaport.address, ethers.constants.MaxUint256)


        //////////////////////

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
            BigInt(apiData.rawData.salt).toString(),   // apiData.rawData.salt
            apiData.rawData.conduitKey,
            apiData.rawData.conduitKey,
            apiData.rawData.consideration.length - 1,
            additonalRecipients,
            apiData.rawData.signature
        ]


        // send tx
        // let tx = await seaport.fulfillBasicOrder(orderParams, { value: apiData.price.amount.raw })



        ///////////////////// 2 encode date
        let SeaportLists = [];
        for (let i = 0; i < apiDatas.length; i++) {

            let apiData = apiDatas[i]

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


            // let tx = await seaport.fulfillBasicOrder(orderParams, { value: apiData.price.amount.raw })

            // let txAdvanced = await seaport.fulfillAdvancedOrder(
            //     advancedOrder,
            //     [],
            //     '0x0000000000000000000000000000000000000000000000000000000000000000',
            //     alice._address,  //sr.address
            //     { value: apiData.price.amount.raw }
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
                nftStandard: 721,   // identify from outside
                nftAddress: apiData.tokenSetId.split(":")[1],
                nftTokenId: apiData.tokenSetId.split(":")[2],
                nftAmount: 1  //  number of buy
            };

            SeaportLists.push(SeaportList);
            // console.log(SeaportList)
        }


        // process.exit() 

        ///////////////////////////////   3  send tx
        let input = ethers.utils.defaultAbiCoder.encode(
            [
                "(address tokenAddress, uint256 tokenValue, bytes inputDate, uint256 nftStandard, address nftAddress, uint256 nftTokenId, uint256 nftAmount)[]",
            ],
            [SeaportLists]
        );

        await sr.connect(alice)['execute(bytes,bytes[],uint256)']('0x10', [input], 2000000000, {value: "138000000000000000000"});


        console.log("after execute nft balance is:", await nft.balanceOf(alice._address))
        console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

    });
});
