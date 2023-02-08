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
    let weth;
    let nftOwnerSigner;


    let mockAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";  //  whale
    let nftAddress = "0x1B23D0f0f6DC3547C1B6945152ACbfd6eAad85B0"  // lens
    let nftOwner = "0x5D1C93b64AB8a9AaE17fA3cCD51eB674b4a5D242"


    let wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    let seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    let makeAddres = '0x65249532663d15a76007688a8bfa1b109973ad41'


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


        const paramsConstractorMatic = {
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
            constructorArgs: [paramsConstractorMatic],
        });

        await sr.deployed();



    });

    it("reservior ERC20 buy", async () => {
        const transactionHash = await alice.sendTransaction({
            to: nftOwner,
            value: ethers.utils.parseEther("1"), // Sends exactly 1.0 ether
        });

        await nft.setApprovalForAll(sr.address, true);

        console.log("nft owner", await nft.ownerOf(5092))

        let inputdata = "0xfb0f3ee100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001b23d0f0f6dc3547c1b6945152acbfd6eaad85b000000000000000000000000000000000000000000000000000000000000013e40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000df37c6d3f5b8150bb26d32f33f75143ed2ef1abe000000000000000000000000004c00500000ad104d7dbd00e3ae0a5c00560c00000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000354a6ba7a1800000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000063e19f260000000000000000000000000000000000000000000000000000000063e5938b0000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000003f1d49d5c145e8f80000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000001550f7dca70000000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000005543df729c0000000000000000000000000002614545d53eb5d026cb42c701dcaf3c7e7bccc8900000000000000000000000000000000000000000000000000000000000000419e3e015d915dc6746ee5ab4a229d405d052a0f20f7e38581d2f6874a0b4431820b22a7d079aaa29fe2cf9ec7f630a7dc725beb9028d8badbcb7f887e748bb1bd1b0000000000000000000000000000000000000000000000000000000000000000000000360c6ebe"

        // await nftOwnerSigner.sendTransaction({
        //       to: seaportAddress,
        //       data: inputdata
        // })

        // const input = await seaportInterface.decodeFunctionData("fulfillBasicOrder", inputdata)

        //   console.log("input:",inpu);
        //   console.log("----------:",inpu[0][0][16])

        //   await seaport.fulfillBasicOrder([
        //     '0x1B23D0f0f6DC3547C1B6945152ACbfd6eAad85B0',
        //     BigNumber.from("5092"),
        //     BigNumber.from("1"),
        //     '0xDF37c6D3f5B8150bB26d32f33F75143ED2Ef1Abe',
        //     '0x004C00500000aD104D7DBd00e3ae0A5C00560C00',
        //     '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        //     BigNumber.from("0"),
        //     BigNumber.from("15000000000000000"),
        //     18,
        //     BigNumber.from("1675730726"),
        //     BigNumber.from("1675989899"),
        //     '0x0000000000000000000000000000000000000000000000000000000000000000',
        //     BigNumber.from("24446860302761739304752683030156737591518664810215442929804930560816386009336"),
        //     '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        //     '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        //     BigNumber.from("2"),
        //     [ [BigNumber.from("375000000000000"),"0x0000a26b00c1F0DF003000390027140000fAa719"],[BigNumber.from("1500000000000000"),"0x2614545d53eB5d026CB42C701dCaF3C7e7bccc89"] ],
        //     '0x9e3e015d915dc6746ee5ab4a229d405d052a0f20f7e38581d2f6874a0b4431820b22a7d079aaa29fe2cf9ec7f630a7dc725beb9028d8badbcb7f887e748bb1bd1b'])


        const params = [
            '0x1B23D0f0f6DC3547C1B6945152ACbfd6eAad85B0',
            BigNumber.from("5092"),
            BigNumber.from("1"),
            '0xDF37c6D3f5B8150bB26d32f33F75143ED2Ef1Abe',
            '0x004C00500000aD104D7DBd00e3ae0A5C00560C00',
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            BigNumber.from("0"),
            BigNumber.from("15000000000000000"),
            18,
            BigNumber.from("1675730726"),
            BigNumber.from("1675989899"),
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            BigNumber.from("24446860302761739304752683030156737591518664810215442929804930560816386009336"),
            '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            BigNumber.from("2"),
            [[BigNumber.from("375000000000000"), "0x0000a26b00c1F0DF003000390027140000fAa719"], [BigNumber.from("1500000000000000"), "0x2614545d53eB5d026CB42C701dCaF3C7e7bccc89"]],
            '0x9e3e015d915dc6746ee5ab4a229d405d052a0f20f7e38581d2f6874a0b4431820b22a7d079aaa29fe2cf9ec7f630a7dc725beb9028d8badbcb7f887e748bb1bd1b']

        inputdata = await seaportInterface.encodeFunctionData("fulfillBasicOrder", [params])

        let SeaportLists = []
        // console.log("inputdata:",inputdata)
        const SeaportList = {
            inputDate: inputdata,
            nftStandard: 721,   // ???
            nftAddress: nftAddress,
            nftTokenId: 5092,
            nftAmount: 1  // ???
        };

        SeaportLists.push(SeaportList);

        let input = ethers.utils.defaultAbiCoder.encode(
            [
                "(bytes inputDate, uint256 nftStandard, address nftAddress, uint256 nftTokenId, uint256 nftAmount)[]",
            ],
            [SeaportLists]
        );
        let sweepInput = ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'uint256'],
            [wethAddress,nftOwner,0]
        );
        console.log("sr weth balance", await weth.balanceOf(sr.address))
        console.log("nftOwner weth balance", await weth.balanceOf(nftOwner))
        console.log("-----------------------------------------------------")
        await sr.connect(nftOwnerSigner)['execute(bytes,bytes[],uint256)']('0x1104', [input,sweepInput], 2000000000);
        console.log("nft owner", await nft.ownerOf(5092))
        console.log("nftOwner weth balance", await weth.balanceOf(nftOwner))
        console.log("sr weth balance", await weth.balanceOf(sr.address))
    });
});
