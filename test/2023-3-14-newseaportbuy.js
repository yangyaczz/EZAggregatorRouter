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
    let nftAddress = "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf"  // ufo

    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000000001ad428e4906aE43D8F9852d0dD6"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'


    let postDatas = [{
        "steps": [
            {
                "id": "auth",
                "action": "Sign in to Blur",
                "description": "Some marketplaces require signing an auth message before filling",
                "kind": "signature",
                "items": []
            },
            {
                "id": "currency-approval",
                "action": "Approve exchange contract",
                "description": "A one-time setup transaction to enable trading",
                "kind": "transaction",
                "items": []
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
                        "data": {
                            "from": "0x604b179ce5607ed63def24d54f3bce01d6fac1b6",
                            "to": "0x00000000000001ad428e4906ae43d8f9852d0dd6",
                            "data": "0xfb0f3ee1000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000031aeb70847e600000000000000000000000000064b2d6c302932d55aa4d57d9b613bdf1600694b500000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b7134df79f3babf83584ea6219ffd4cb2747bbf000000000000000000000000000000000000000000000000000000000000094100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006406f1e300000000000000000000000000000000000000000000000000000000642fd0630000000000000000000000000000000000000000000000000000000000000000360c6ebe0000000000000000000000000000000000000000d826f99208305db40000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000470de4df820000000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000058d15e176280000000000000000000000000004df17f9977a174214b247f0625ef8ca3bdc3a6400000000000000000000000000000000000000000000000000000000000000103a45abf25b7aee6cbb9effcb5602f5a0effe21293e6f4cd9af10345892f71fdfaecb693604f9b10fe1add68c6d43486c3475d263f6916581b08661e31b3aeed4f00002d4341f2d4fff70600e40a4d18d8db889feea6d9e2e83fc539ec9223c2eb6c7338bedd0cf36573bf25ba3b3cd0d42b186c1281127412a1b7c66ce77f42e42f86ed0a76305ec88ec6f6d44db9ea8f3c028ae1d42498eeeebbf188ad644d361149dfc9ef3cae1d3325c401f19ed982fe6318b6b9a935d97d278f1b27174ad5f384284af774371f1ab6879ac7051d1fbef02bb5583f84156427b84d81e6c28e6cfbef1169edb4fa9a7b07e8b7aa52eee49b82b7d86a6a00df0915fe91c578cf5f6d060000000000000000000000000000000000000000000000000000000000",
                            "value": "0x03782dace9d90000"
                        }
                    }
                ]
            }
        ],
        "path": [
            {
                "orderId": "0x3253a4b0b256c8eb444fded476d9d569f674d507127bff38d29280b42383c2cf",
                "contract": "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf",
                "tokenId": "2369",
                "quantity": 1,
                "source": "opensea.io",
                "currency": "0x0000000000000000000000000000000000000000",
                "quote": 0.25,
                "rawQuote": "250000000000000000"
            }
        ]
    }]

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



        ///////////////////// 2 encode date
        let SeaportLists = [];
        let totalValue = ethers.BigNumber.from('0');
        for (let i = 0; i < postDatas.length; i++) {

            let stepslength = postDatas[i].steps.length
            
            if (postDatas[i].steps[stepslength-1].items[0].data.to != seaportAddress.toLowerCase()) {
                continue
            }

            let inputdata = postDatas[i].steps[stepslength-1].items[0].data.data

            if (postDatas[i].path[0].currency == "0x0000000000000000000000000000000000000000"){
                let value = ethers.BigNumber.from(postDatas[i].path[0].rawQuote)
                totalValue = totalValue.add(value)
            }

            
            const SeaportList = {
                tokenAddress: postDatas[i].path[0].currency,
                tokenValue: postDatas[i].path[0].rawQuote,
                inputDate: inputdata,
                nftStandard: 721,   // identify from outside
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


        console.log("after execute nft balance is:", await nft.balanceOf(alice._address))
        console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

    });
});
