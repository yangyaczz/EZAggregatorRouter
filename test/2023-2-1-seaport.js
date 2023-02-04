const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const seaportABI = require("./abis/Seaport.json")
const nftABI = require("./abis/ERC721.json")

describe("seaport", function () {
    let alice;
    let nft;
    let seaport;

    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let mockAddress = '0x176F3DAb24a159341c0509bB36B833E7fdd0a132';
    let nftAddress = '0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e';
    let blocknumber = 16540164;

    let apiData = {
        "id": "0xbd50af558c1f3b905386e3cddf062f016ebefdf17db9601a1c61eaa40ddd9863",
        "kind": "seaport",
        "side": "sell",
        "status": "active",
        "tokenSetId": "token:0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e:5071",
        "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "contract": "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
        "maker": "0x27a0660fb6d599482b96ed7ddf97b5265710d6fa",
        "taker": "0x0000000000000000000000000000000000000000",
        "price": {
            "currency": {
                "contract": "0x0000000000000000000000000000000000000000",
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "amount": {
                "raw": "700000000000000000",
                "decimal": 0.7,
                "usd": 1150.00002,
                "native": 0.7
            },
            "netAmount": {
                "raw": "630000000000000000",
                "decimal": 0.63,
                "usd": 1035.00002,
                "native": 0.63
            }
        },
        "validFrom": 1675178302,
        "validUntil": 1675437502,
        "quantityFilled": 0,
        "quantityRemaining": 1,
        "criteria": {
            "kind": "token",
            "data": {
                "token": {
                    "tokenId": "5071"
                }
            }
        },
        "source": {
            "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
            "domain": "opensea.io",
            "name": "OpenSea",
            "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
            "url": "https://opensea.io/assets/0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e/5071"
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
        "expiration": 1675437502,
        "isReservoir": null,
        "isDynamic": false,
        "createdAt": "2023-01-31T15:28:11.985Z",
        "updatedAt": "2023-01-31T15:28:11.985Z",
        "rawData": {
            "kind": "single-token",
            "salt": "0x360c6ebe0000000000000000000000000000000000000000d5bec54f3efa23f3",
            "zone": "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
            "offer": [
                {
                    "token": "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
                    "itemType": 2,
                    "endAmount": "1",
                    "startAmount": "1",
                    "identifierOrCriteria": "5071"
                }
            ],
            "counter": "0",
            "endTime": 1675437502,
            "offerer": "0x27a0660fb6d599482b96ed7ddf97b5265710d6fa",
            "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "orderType": 2,
            "signature": "0x82f4e52fa2cee190213889e10b6016fcce2248e2d619d3a9fd99b55900e1bf7009aaa800d687063f6b5cc538abff06bbcc935fcd6b1a3a476d3c92f56c743f0b1b",
            "startTime": 1675178302,
            "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "consideration": [
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "630000000000000000",
                    "recipient": "0x27a0660fb6d599482b96ed7ddf97b5265710d6fa",
                    "startAmount": "630000000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "17500000000000000",
                    "recipient": "0x0000a26b00c1f0df003000390027140000faa719",
                    "startAmount": "17500000000000000",
                    "identifierOrCriteria": "0"
                },
                {
                    "token": "0x0000000000000000000000000000000000000000",
                    "itemType": 0,
                    "endAmount": "52500000000000000",
                    "recipient": "0xe382357719828bb01c6116d564aba0b15f2ac89e",
                    "startAmount": "52500000000000000",
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
                    chainId: 1,
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/b5Av64vYI2CowvlC4ezAAyDrbdNQ0rPx",
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

        nft = new ethers.Contract(nftAddress, nftABI, alice);
        seaport = new ethers.Contract(seaportAddress, seaportABI, alice)

    });

    it("seaport fulfillBasicOrder", async () => {

        console.log("alice eth balance is:", ethers.utils.formatEther(await ethers.provider.getBalance(alice._address)))
        console.log(
            "before execute alice nft balance:",
            await nft.balanceOf(alice._address)
        );


        // get additonalRecipients
        let additonalRecipients = []
        for (let i=1; i< apiData.rawData.consideration.length ; i++){
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
        let tx = await seaport.fulfillBasicOrder(orderParams, { value: apiData.price.amount.raw })


        // cheak result
        console.log(
            "after execute alice nft balance:",
            await nft.balanceOf(alice._address),
        );
    });
});
