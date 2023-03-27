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
    let nftAddress = "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d"  // lens

    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000000001ad428e4906aE43D8F9852d0dD6"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'


    let postDatas = [{
        "steps": [
            {
                "id": "currency-approval",
                "action": "Approve exchange contract",
                "description": "A one-time setup transaction to enable trading",
                "kind": "transaction",
                "items": [
                    {
                        "status": "incomplete",
                        "data": {
                            "from": "0x59e0b0c67a8f14be8c5855c95cdd2ba95a7f2bbb",
                            "to": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                            "data": "0x095ea7b30000000000000000000000001e0049783f008a0085193e00003d00cd54003c71ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                        }
                    }
                ]
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
                        "orderIds": [
                            "0x18cbd366eed50d66586092542922205bcc7b9266ea2ebb8206273f6273c2255a"
                        ],
                        "data": {
                            "from": "0x59e0b0c67a8f14be8c5855c95cdd2ba95a7f2bbb",
                            "to": "0x00000000000001ad428e4906ae43d8f9852d0dd6",
                            "data": "0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cfb72bc0000000000000000000000005d240c929f7cd49625d207bf3334cc20e1450a8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db46d1dc155634fbc732f92e853b10b288ad5a1d0000000000000000000000000000000000000000000000000000000000006ad800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000006421bfa200000000000000000000000000000000000000000000000000000000644a9bfb0000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000002cacd378293367d80000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000010b3640000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000040c90c9154845a3a1f30391e7b0edfce2575d7571997b7545a77f9ff8f364800568d3f769b40d689aecf948c3f69a4b9e8312ae9a95fa801983c76e4c349c813c0"
                        }
                    }
                ]
            }
        ],
        "path": [
            {
                "orderId": "0x18cbd366eed50d66586092542922205bcc7b9266ea2ebb8206273f6273c2255a",
                "contract": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
                "tokenId": "27352",
                "quantity": 1,
                "source": "opensea.io",
                "currency": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
                "quote": 218.9,
                "rawQuote": "218900000"
            }
        ]
    }]

    beforeEach(async () => {

        // await network.provider.request({
        //     method: "hardhat_reset",
        //     params: [
        //         {
        //             chainId: 137,
        //             forking: {
        //                 jsonRpcUrl: "https://1rpc.io/matic",
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

        nft = new ethers.Contract(nftAddress, nft721ABI, alice);   //

        weth = new ethers.Contract(wethAddress, wethABI, alice)
        usdc = new ethers.Contract(usdcAddress, wethABI, alice)
        seaport = new ethers.Contract(seaportAddress, seaportABI, alice)

        seaportInterface = new ethers.utils.Interface(seaportABI)


        const paramsConstractorMatic = {
            weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
            reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
            seaportModule: "0xe225aFD0B78a265a60CCaEB1c1310e0016716E7B", // SeaportModule 
            ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
            seaport: "0x00000000000001ad428e4906aE43D8F9852d0dD6", // seaport
            ezswapV2: "0x183Eb45a05EA5456A6D329bb76eA6C6DABb375a6"   //  ezswapv2

        };

        sr = await (
            await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
        ).deploy(paramsConstractorMatic);


    });

    it("router  buy", async () => {

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

            if (postDatas[i].steps[stepslength - 1].items[0].data.to != seaportAddress.toLowerCase()) {
                continue
            }

            let inputdata = postDatas[i].steps[stepslength - 1].items[0].data.data

            if (postDatas[i].path[0].currency == "0x0000000000000000000000000000000000000000") {
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
