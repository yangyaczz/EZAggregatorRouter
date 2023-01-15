const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nftABI = require("./abis/ERC721.json");
const wethABI = require("./abis/WETH.json");

const seaportABI = require("./abis/Seaport.json")
const conduitABI = require("./abis/Conduit.json")


describe("aggregator sell nft mulit test", function () {
    let alice;
    let nft;
    let sr;

    let seaport;
    let conduit;

    beforeEach(async () => {
        const mockAddress = "0xc36bd1d1e2cfce872464bf243b5062e7b97a50c3";
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [mockAddress],
        });

        await network.provider.send("hardhat_setBalance", [
            "0xc36bd1d1e2cfce872464bf243b5062e7b97a50c3",
            '0x1d6329f1c35ca4bfabb9f560ffffffffff'
        ]);

        alice = await ethers.provider.getSigner(mockAddress);
        ////////////////////////

        seaport = new ethers.Contract("0x00000000006c3852cbef3e08e8df289169ede581", seaportABI, alice)
        conduit = new ethers.Contract("0x1e0049783f008a0085193e00003d00cd54003c71", conduitABI, alice)


        ////////////




        const nftAddress = "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e";
        nft = new ethers.Contract(nftAddress, nftABI, alice);

        const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        weth = new ethers.Contract(wethAddress, wethABI, alice);



        const SR = await ethers.getContractFactory("EZAggregatorV1Router")
        sr = await SR.attach("0xac3e3114784b46a8b201c07B69Db87BBCDbc9179")

        //////////////////////
    });

    it("sell nft through simpleRouter", async () => {


        console.log(
            "taker address is:",
            alice._address,
            "relayer address is:",
            sr.address
        );

        console.log(
            "before execute taker nft balance:",
            await nft.balanceOf(alice._address),
            "before execute relayer nft balance:",
            await nft.balanceOf(sr.address)
        );


        ////////////////////////////////// 1 get from api




        const dataApi1 = "0xb88d4fde000000000000000000000000ac3e3114784b46a8b201c07b69db87bbcdbc9179000000000000000000000000385df8cbc196f5f780367f3cdc96af072a916f7e0000000000000000000000000000000000000000000000000000000000001f2c000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004e4760f2a0b000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000385df8cbc196f5f780367f3cdc96af072a916f7e0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e4267bf79700000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000ac3e3114784b46a8b201c07b69db87bbcdbc9179000000000000000000000000ac3e3114784b46a8b201c07b69db87bbcdbc9179000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000385df8cbc196f5f780367f3cdc96af072a916f7e00000000000000000000000000000000000000000000000005e1a3dac7cf80000000000000000000000000000000000000000000000000000000000000001f2c000000000000000000000000000000000000000000000000000000000000264800000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000edbe6ed3426e6c12bf1d1cd4ba06cc620d0800f1000000000000000000000000bce3781ae7ca1a5e050bd9c4c77369867ebc307e00000000000000000000000000000000000000000000000005e1a3dac7cf80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000009f93623019049c76209c26517acc2af9d49c69b000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000005096100000000000000000000000000000000000000000000000000000000063bd27e40000000000000000000000000000000000000000000000000000000063bd2fb400000000000000000000000000000000000000000000000000000000000021340000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001bfe4026261705b27afe5b6e46d3092b29c21e5e77dfddba3f6376ad02f4cd369959dbddd2493c21a68faf27f5c96e33a4638e829268e77f152d6bf37e84a14467000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        const offerAmount1 = "417443000000000000"   // 




        const dataApis = [dataApi1]
        const collections = ["0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e"]
        const offerAmounts = [offerAmount1]



        ///////////////////// 2 encode date

        let ReservoirOffers = [];

        for (let i = 0; i < dataApis.length; i++) {

            const decode = hre.ethers.utils.defaultAbiCoder.decode(
                ["address", "address", "uint256", "bytes"],
                ethers.utils.hexDataSlice(dataApis[i], 4)
            );

            let offerMarketId;
            if (decode[1] == "0x3729014ef28f01B3ddCF7f980D925E0B71b1F847") {
                offerMarketId = 0;
            } else if (decode[1] == "0x385df8CBC196f5f780367F3cDC96aF072a916F7E") {
                offerMarketId = 1;
            } else if (decode[1] == "0x613D3c588F6B8f89302b463F8F19f7241B2857E2") {
                offerMarketId = 2;
            } else {
                return;
            }

            const ReservoirOffer = {
                offerMarket: offerMarketId,
                tokenStandard: 721, // erc721 is fixed
                collection: collections[i], // api
                tokenId: decode[2],
                tokenAmount: 1, // erc721 is fixed
                inputDate: decode[3],
                offerAmount: offerAmounts[i], // api
            };


            ReservoirOffers.push(ReservoirOffer);

        }




        ///////////////////////////////   3  send tx
        let input = ethers.utils.defaultAbiCoder.encode(
            [
                "(uint8 offerMarket, uint256 tokenStandard, address collection,uint256 tokenId, uint256 tokenAmount, bytes inputDate, uint256 offerAmount)[]",
            ],
            [ReservoirOffers]
        );


        await nft.setApprovalForAll(sr.address, true);

        await sr.connect(alice)["execute(bytes,bytes[],uint256)"]("0x01", [input], 2000000000);

        console.log(
            "after execute taker nft balance:",
            await nft.balanceOf(alice._address),
            "after execute relayer nft balance:",
            await nft.balanceOf(sr.address),
            "after execute relayer weth balance:",
            await weth.balanceOf(sr.address),
        );
    });
});
