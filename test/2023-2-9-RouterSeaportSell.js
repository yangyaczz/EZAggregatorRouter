const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nft721ABI = require("./abis/ERC721.json");
const nft1155ABI = require("./abis/ERC1155.json");
const wethABI = require("./abis/WETH.json")

const seaportABI = require("./abis/Seaport.json")

describe("aggregator matic buy 1155nft throught erc20 test", function () {
    let alice;
    let nft;
    let sr;
    let weth


    let blocknumber = 38892764
    let mockAddress = "0x5063e320F8CBBe347C374f7CFaaE3Fb392d98b78";  // nft  whale
    let nftAddress = "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3"  //   1155


    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'



    let apiDatas = [{
        "id": "0x8cbb5cefd14160b9f3555f561772e7a55248b5334d0f8c7603725320c002e5cd",
        "kind": "seaport",
        "side": "buy",
        "status": "active",
        "tokenSetId": "contract:0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "maker": "0x101eb380d06e443c7d456aed63961b16e290d8c7",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                "name": "Wrapped Ether",
                "symbol": "WETH",
                "decimals": 18
            },
            "amount": {
                "raw": "2400000000000000",
                "decimal": 0.0024,
                "usd": 3.96307,
                "native": 3.03386
            },
            "netAmount": {
                "raw": "2148000000000000",
                "decimal": 0.00215,
                "usd": 3.54695,
                "native": 2.7153
            }
        },
        "validFrom": 1675345137,
        "validUntil": 1675949926,
        "quantityFilled": 0,
        "quantityRemaining": 5,
        "criteria": {
            "kind": "collection",
            "data": {
                "collection": {
                    "id": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
            "domain": "opensea.io"
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
        "expiration": 1675949926,
        "isReservoir": null,
        "createdAt": "2023-02-02T13:39:05.579Z",
        "updatedAt": "2023-02-09T04:59:53.600Z",
        "rawData": null
    },
    {
        "id": "0x38ea25607eb10817eed75ae84b38291ae925c561461b07932c5aee9aa3f9b8ee",
        "kind": "seaport",
        "side": "buy",
        "status": "active",
        "tokenSetId": "contract:0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3",
        "maker": "0x101eb380d06e443c7d456aed63961b16e290d8c7",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                "name": "Wrapped Ether",
                "symbol": "WETH",
                "decimals": 18
            },
            "amount": {
                "raw": "600000000000000",
                "decimal": 0.0006,
                "usd": 0.99077,
                "native": 0.75846
            },
            "netAmount": {
                "raw": "537000000000000",
                "decimal": 0.00054,
                "usd": 0.88674,
                "native": 0.67883
            }
        },
        "validFrom": 1675344403,
        "validUntil": 1675949169,
        "quantityFilled": 0,
        "quantityRemaining": 6,
        "criteria": {
            "kind": "collection",
            "data": {
                "collection": {
                    "id": "0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
            "domain": "opensea.io"
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
        "expiration": 1675949169,
        "isReservoir": null,
        "createdAt": "2023-02-02T13:26:47.922Z",
        "updatedAt": "2023-02-09T04:59:53.600Z",
        "rawData": null
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

    it("router ERC20 buy 1155", async () => {


        console.log("router address:", sr.address)
        console.log("before execute nft balance is:", await nft.balanceOf(alice._address, 0))
        console.log("before execute usdc balance is:", await usdc.balanceOf(alice._address))


        ///////////////////// 1 approve
        // await usdc.approve(sr.address, ethers.constants.MaxUint256)
        // await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        // await weth.approve(sr.address, ethers.constants.MaxUint256)
        // await weth.approve(seaport.address, ethers.constants.MaxUint256)


        await nft.approve(sr.address, true)



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
                numerator: ethers.BigNumber.from('1'),  // number of sell
                denominator: ethers.BigNumber.from(apiData.quantityFilled).add(ethers.BigNumber.from(apiData.quantityRemaining)), 
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
                tokenValue: apiData.price.netAmount.raw,
                inputDate: inputdata,
                nftStandard: 1155,   // identify from outside
                nftAddress: apiData.tokenSetId.split(":")[1],
                nftTokenId: 5,   //  get from users
                nftAmount: 1  //  number of sell
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

        await sr.connect(alice)['execute(bytes,bytes[],uint256)']('0x11', [input], 2000000000);


        console.log("after execute nft balance is:", await nft.balanceOf(alice._address, 0))
        // console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

    });
});
