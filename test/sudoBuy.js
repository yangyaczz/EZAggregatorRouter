const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nftABI = require("./abis/ERC721.json");
const wethABI = require("./abis/WETH.json");
const sudoABI = require("./abis/Sudoswap.json");

let orders = require("./orders/orders.json")


describe("loop sell nft mulit test", function () {
    let alice;
    let nft;
    let sr;
    let sudointerface;

    let DEADLINE = 1673657953;




    beforeEach(async () => {


        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/b5Av64vYI2CowvlC4ezAAyDrbdNQ0rPx",
                        blockNumber: 16382024,
                    },
                },
            ],
        });



        const mockAddress = "0x21C8e614CD5c37765411066D2ec09912020c846F";
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [mockAddress],
        });

        // await network.provider.send("hardhat_setBalance", [
        //     "0xc36bd1d1e2cfce872464bf243b5062e7b97a50c3",
        //     '0x1d6329f1c35ca4bfabb9f560ffffffffff'
        // ]);

        alice = await ethers.provider.getSigner(mockAddress);
        ////////////////////////

        sudointerface = new ethers.utils.Interface(sudoABI);



        const nftAddress = "0xfA9937555Dc20A020A161232de4D2B109C62Aa9c";
        nft = new ethers.Contract(nftAddress, nftABI, alice);

        const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        weth = new ethers.Contract(wethAddress, wethABI, alice);

        const SR = await ethers.getContractFactory("EZAggregatorV1Router")
        sr = await SR.attach("0xac3e3114784b46a8b201c07B69Db87BBCDbc9179")
        //////////////////////
    });

    it("buy nft through Router", async () => {

        let v1 = await ethers.provider.getBalance("0x8EF610B202B76057E63E9191fcdB1E8291dF1f18")
        let v2 = await ethers.provider.getBalance("0x339e7004372e04b1d59443f0ddc075efd9d80360")
        let vall = v1.add(v2)

        // console.log(vall)

        let aaaa = 0x016bde7285e54000

        const value = await ethers.utils.parseUnits("0.10242", 18)
        const calldata = sudointerface.encodeFunctionData(
            "robustSwapETHForSpecificNFTs",
            [
                [
                    [
                        ["0x8EF610B202B76057E63E9191fcdB1E8291dF1f18", ['346', '370', '380', '388', '394', '396', '415', '469', '930']],
                        "92700000000000000",
                    ],
                    [
                        ["0x339e7004372e04b1d59443f0ddc075efd9d80360", ['80']],
                        "9720000000000000",
                    ],

                ],
                alice._address,
                alice._address,
                DEADLINE,
            ]
        );

        // console.log(calldata)
        console.log("==================")

        //////////////////////
        let inputs = []
        inputs.push(ethers.utils.defaultAbiCoder.encode(['uint256', 'bytes'], [value, calldata]))

        // console.log(inputs[0])

        // const receipt = await (
        //     await sr['execute(bytes,bytes[],uint256)']('0x08', inputs, DEADLINE, { value: value })
        // ).wait()

        const receipt = await sr['execute(bytes,bytes[],uint256)']('0x08', inputs, DEADLINE, { value: value })

        console.log(receipt)


        // console.log(await nft.balanceOf(alice._address))


        let v12 = await ethers.provider.getBalance("0x8EF610B202B76057E63E9191fcdB1E8291dF1f18")
        let v22 = await ethers.provider.getBalance("0x339e7004372e04b1d59443f0ddc075efd9d80360")
        let vall2 = v12.add(v22)

        let m1 = v12.sub(v1)
        let m2 = v22.sub(v2)

        let m = vall2.sub(vall)
        // console.log("all:", m, m1, m2)



        let in1 = "0x000000000000000000000000000000000000000000000000016be78ad457e000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003643efd9e71000000000000000000000000000000000000000000000000000000000000008000000000000000000000000021c8e614cd5c37765411066d2ec09912020c846f00000000000000000000000021c8e614cd5c37765411066d2ec09912020c846f0000000000000000000000000000000000000000000000000000000063c21e26000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000001495628aaadc0000000000000000000000000008ef610b202b76057e63e9191fcdb1e8291df1f1800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000015a0000000000000000000000000000000000000000000000000000000000000172000000000000000000000000000000000000000000000000000000000000017c0000000000000000000000000000000000000000000000000000000000000184000000000000000000000000000000000000000000000000000000000000018a000000000000000000000000000000000000000000000000000000000000018c000000000000000000000000000000000000000000000000000000000000019f00000000000000000000000000000000000000000000000000000000000001d500000000000000000000000000000000000000000000000000000000000003a2000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000228849db378000000000000000000000000000339e7004372e04b1d59443f0ddc075efd9d8036000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000"
        let aaaaaa = ethers.utils.defaultAbiCoder.decode(['uint256', 'bytes'], in1)
        console.log(aaaaaa)
        
    });
});
