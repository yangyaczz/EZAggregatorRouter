const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

const nft721ABI = require("./abis/ERC721.json");
const nft1155ABI = require("./abis/ERC1155.json");
const wethABI = require("./abis/WETH.json")

const seaportABI = require("./abis/Seaport.json")

//block number 16582871
describe("seaport sell nft", function () {
    let alice;
    let nft;
    let sr;
    let weth;
    let nftOwnerSigner;


    let nftAddress = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
    let nftOwner = "0x07130fe9BF015fAB3a34690A43BdEeE5920DC9D5";


    let wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

    const apiDatas = [
        {
            "id": "0x3f2e0739beab0606f87d38178c810e3adbcc020237c791e3ca459583bd56a868",
            "kind": "seaport",
            "side": "buy",
            "status": "active",
            "tokenSetId": "token:0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d:9569",
            "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "contract": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
            "maker": "0x241fc87735581746d98967db408b72a3ccc87624",
            "taker": "0x0000000000000000000000000000000000000000",
            "price": {
                "currency": {
                    "contract": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    "name": "Wrapped Ether",
                    "symbol": "WETH",
                    "decimals": 18
                },
                "amount": {
                    "raw": "75000000000000000000",
                    "decimal": 75,
                    "usd": 125606.4081,
                    "native": 75
                },
                "netAmount": {
                    "raw": "71250000000000000000",
                    "decimal": 71.25,
                    "usd": 119326.08769,
                    "native": 71.25
                }
            },
            "validFrom": 1675841677,
            "validUntil": 1675884874,
            "quantityFilled": 0,
            "quantityRemaining": 1,
            "criteria": {
                "kind": "token",
                "data": {
                    "token": {
                        "tokenId": "9569",
                        "name": null,
                        "image": "https://i.seadn.io/gae/vHwOeFFEAVbYwr-udKXFTFjU55EloJ-k6MISNi-Ex-Jnlb3zX8ZzyjDQfGH9aaGWbzlK1DDJFeozf33NYlw_AghiKub1-j90v40PYBI?w=500&auto=format"
                    },
                    "collection": {
                        "id": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
                        "name": "Bored Ape Yacht Club",
                        "image": "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format"
                    }
                }
            },
            "source": {
                "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
                "name": "OpenSea",
                "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
                "url": "https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9569",
                "domain": "opensea.io"
            },
            "feeBps": 500,
            "feeBreakdown": [
                {
                    "bps": 250,
                    "kind": "marketplace",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
                },
                {
                    "bps": 250,
                    "kind": "royalty",
                    "recipient": "0xa858ddc0445d8131dac4d1de01f834ffcba52ef1"
                }
            ],
            "expiration": 1675884874,
            "isReservoir": null,
            "createdAt": "2023-02-08T07:34:58.900Z",
            "updatedAt": "2023-02-08T07:34:58.900Z",
            "rawData": {
                "kind": "single-token",
                "salt": "0x360c6ebe0000000000000000000000000000000000000000e8dcbe83b54b5a21",
                "zone": "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
                "offer": [
                    {
                        "token": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                        "itemType": 1,
                        "endAmount": "75000000000000000000",
                        "startAmount": "75000000000000000000",
                        "identifierOrCriteria": "0"
                    }
                ],
                "counter": "0",
                "endTime": 1675884874,
                "offerer": "0x241fc87735581746d98967db408b72a3ccc87624",
                "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "orderType": 2,
                "signature": "0x395664b5c89719dd3b54ce8518a80e736c152111993a42a5b3670dc25e03506a2db5c984ea1f8da824bb6015953c9815aaad132551a74ec7a4f844f857f783f51c",
                "startTime": 1675841677,
                "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
                "consideration": [
                    {
                        "token": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
                        "itemType": 2,
                        "endAmount": "1",
                        "recipient": "0x241fc87735581746d98967db408b72a3ccc87624",
                        "startAmount": "1",
                        "identifierOrCriteria": "9569"
                    },
                    {
                        "token": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                        "itemType": 1,
                        "endAmount": "1875000000000000000",
                        "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                        "startAmount": "1875000000000000000",
                        "identifierOrCriteria": "0"
                    },
                    {
                        "token": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                        "itemType": 1,
                        "endAmount": "1875000000000000000",
                        "recipient": "0xa858ddc0445d8131dac4d1de01f834ffcba52ef1",
                        "startAmount": "1875000000000000000",
                        "identifierOrCriteria": "0"
                    }
                ]
            }
        }
    ]


    beforeEach(async () => {
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [nftOwner],
        });
        [alice] = await ethers.getSigners();

        nftOwnerSigner = await ethers.provider.getSigner(nftOwner);

        nft = new ethers.Contract(nftAddress, nft721ABI, nftOwnerSigner);

        weth = new ethers.Contract(wethAddress, wethABI, nftOwnerSigner)

        seaport = new ethers.Contract(seaportAddress, seaportABI, nftOwnerSigner);

        seaportInterface = new ethers.utils.Interface(seaportABI);


        const paramsConstractor = {
            weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            reservoir: "0x178A86D36D89c7FDeBeA90b739605da7B131ff6A",
            seaportModule: "0x3729014ef28f01B3ddCF7f980D925E0B71b1F847",
            looksRareModule: "0x385df8CBC196f5f780367F3cDC96aF072a916F7E",
            x2y2Module: "0x613D3c588F6B8f89302b463F8F19f7241B2857E2",
            sudoswap: "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329",
            ezswap: "0xa63eC144d070a1BF19a7577C88c580E7de92E0fc",
            seaport: "0x00000000006c3852cbEf3e08E8dF289169EdE581"  // seaport
        };

        const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgrade");

        sr = await upgrades.deployProxy(EZA, [], {
            constructorArgs: [paramsConstractor],
        });

        await sr.deployed();



    });

    it("seaport sell erc721 nft", async () => {
        //////////////////// 1 setApprovalForAll
        await nft.setApprovalForAll(sr.address, true);

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

            let orderParams = [
                apiData.rawData.consideration[0].token,
                apiData.rawData.consideration[0].identifierOrCriteria,
                apiData.rawData.consideration[0].endAmount,
                apiData.rawData.offerer,
                apiData.rawData.zone,
                apiData.rawData.offer[0].token,
                apiData.rawData.offer[0].identifierOrCriteria,
                apiData.rawData.offer[0].endAmount,
                18,            // apiData.rawData.orderType 
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
            // let txAdvanced = await seaport.fulfillBasicOrder(
            //     orderParams
            // )
            // console.log("txAdvanced:",txAdvanced)
            // return;
            let inputdata = seaportInterface.encodeFunctionData("fulfillBasicOrder", [orderParams])

            const SeaportList = {
                inputDate: inputdata,
                nftStandard: 721,   // identify from outside
                nftAddress: apiData.tokenSetId.split(":")[1],
                nftTokenId: apiData.tokenSetId.split(":")[2],
                nftAmount: 1,  //  number of buy
                tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                tokenApproveAmount: 0
            };

            SeaportLists.push(SeaportList);
            // console.log(SeaportList)
        }

        let input = ethers.utils.defaultAbiCoder.encode(
            [
                "(bytes inputDate, uint256 nftStandard, address nftAddress, uint256 nftTokenId, uint256 nftAmount)[]",
            ],
            [SeaportLists]
        );
        let sweepInput = ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'uint256'],
            [wethAddress, nftOwner, 0]
        );
        await sr.connect(nftOwnerSigner)['execute(bytes,bytes[],uint256)']('0x1104', [input, sweepInput], 2000000000);
        for (let i = 0; i < apiDatas.length; i++) {
            const nftId = apiDatas[i].tokenSetId.split(":")[2];
            const offerer = apiDatas[i].rawData.offerer;
            const newNftOwner = await nft.ownerOf(nftId);
            expect(newNftOwner.toLowerCase()).to.eq(offerer.toLowerCase())

            // const receiveAmount = apiDatas[i].price.netAmount.raw;
            // const nftOwnerAmount = await weth.balanceOf(nftOwner)
            // expect(receiveAmount).to.eq(nftOwnerAmount)
        }
    });
});
