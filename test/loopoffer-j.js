const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nftABI = require("./abis/ERC721.json");
const wethABI = require("./abis/WETH.json");

let orders = require("./orders/orders.json")
const fetch = require("node-fetch"); 


describe("loop sell nft mulit test", function () {
    let alice;
    let nft;
    let sr;

    let blocknumber = 16390391
    let nfttrader = "0x64C362d2fF237f44C8a774A973984886dBd9B21D"
    let nftAddress = "0x67d9417c9c3c250f61a83c7e8658dac487b56b09"
    let tokenid = 7055
    let nftTokenId = "0x67d9417c9c3c250f61a83c7e8658dac487b56b09:7055"


    beforeEach(async () => {


        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/b5Av64vYI2CowvlC4ezAAyDrbdNQ0rPx",
                        blockNumber: blocknumber,
                    },
                },
            ],
        });



        const mockAddress = nfttrader;
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [mockAddress],
        });

        await network.provider.send("hardhat_setBalance", [
            nfttrader,
            "0x1d6329f1c35ca4bfabb9f560ffffffffff"
        ]);

        alice = await ethers.provider.getSigner(mockAddress);
        ////////////////////////


        nft = new ethers.Contract(nftAddress, nftABI, alice);

        const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        weth = new ethers.Contract(wethAddress, wethABI, alice);

        const SR = await ethers.getContractFactory("EZAggregatorV1Router")
        sr = await SR.attach("0xac3e3114784b46a8b201c07B69Db87BBCDbc9179")
        //////////////////////
    });

    it("sell nft through simpleRouter", async () => {

        orders = orders.orders


        // console.log(orders)

        for (let i = 0; i < orders.length; i = i + 3) {
            await network.provider.send("hardhat_setBalance", [
                nfttrader,
                "0x1d6329f1c35ca4bfabb9f560ffffffffff"
            ]);

            console.log("====================================================")


            let orderIdb = orders[i].id
            let maker = orders[i].maker
            let kind = orders[i].kind

            let newOwner = await nft.ownerOf(tokenid)
            console.log(i, "before nft====", newOwner, "====", alice._address)

            try {

                let options = {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        "x-api-key": "7c0b45ea-0238-5b5f-8c1d-08fb2c02d27b",
                    },
                    body: JSON.stringify({
                        orderId: orderIdb,
                        taker: alice._address,
                        token: nftTokenId,
                    }),
                };

                let data
                let to

                await fetch("https://api.reservoir.tools/execute/sell/v6", options)
                    .then((response) => response.json())
                    .then((response) => {
                        data = response.steps[1].items[0].data.data
                        to = response.steps[1].items[0].data.to
                    })
                    .catch((err) => {
                        // console.error(err)
                        console.log(i, "fetch error")
                    }
                    );

                /////////////////////////////////////



                try {

                    // console.log(
                    //     "before execute taker nft balance:",
                    //     await nft.balanceOf(alice._address),
                    //     await nft.balanceOf(maker)
                    // );

                    await (await alice.sendTransaction({
                        to: nftAddress,
                        data: data
                    })).wait()

                    // console.log(i, "call success")
                    // console.log(
                    //     "after execute taker nft balance:",
                    //     await nft.balanceOf(alice._address),
                    //     await nft.balanceOf(maker)
                    // );

                    newOwner = await nft.ownerOf(tokenid)

                    if (newOwner != alice._address) {

                        await network.provider.request({
                            method: "hardhat_impersonateAccount",
                            params: [newOwner],
                        });

                        await network.provider.send("hardhat_setBalance", [
                            newOwner,
                            '0x1d6329f1c35ca4bfabb9f560ffffffffff'
                        ]);

                        nftreceiver = await ethers.provider.getSigner(newOwner);

                        await nft.connect(nftreceiver)['safeTransferFrom(address,address,uint256)'](newOwner, alice._address, tokenid)

                        // newOwner = await nft.ownerOf(tokenid)
                        // console.log(i, "after transfer nft====", newOwner, "====", alice._address)

                        // console.log(
                        //     "after safeTransferFrom nft balance:",
                        //     await nft.balanceOf(alice._address),
                        //     await nft.balanceOf(maker)
                        // );
                        console.log(i, "call success")

                    } else {
                        console.log(i, "sendTransaction fail")
                    }

                } catch {
                    console.log(i, "call error, orderId:", orderIdb, "kind:", kind)
                    continue
                }



            } catch {
                console.log(i, "post error, orderId:", orderIdb, "kind:", kind)
                continue
            }

        }








        // console.log(
        //     "before execute taker nft balance:",
        //     await nft.balanceOf(alice._address)
        // );


        // let data = "0xb88d4fde00000000000000000000000064c362d2ff237f44c8a774a973984886dbd9b21d000000000000000000000000613d3c588f6b8f89302b463f8f19f7241b2857e20000000000000000000000000000000000000000000000000000000000001b8f00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000964760f2a0b000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000613d3c588f6b8f89302b463f8f19f7241b2857e2000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000864f2ec5c5200000000000000000000000000000000000000000000000000000000000000a000000000000000000000000064c362d2ff237f44c8a774a973984886dbd9b21d00000000000000000000000064c362d2ff237f44c8a774a973984886dbd9b21d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000840000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000aa24b31e31cb0000000000000000000000000000000000000000000000000000000063bbf7f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000613d3c588f6b8f89302b463f8f19f7241b2857e2000000000000000000000000000000000000000000000000000000000000000031a1c11f5a0ce0afec3f55d6cc3e9c6167ce1193636d9f2fd2da82d4848146770ee943f854809f71da072c82ac4f5b73a6736d6ae2ae82e8572cf842bf5f17b5000000000000000000000000000000000000000000000000000000000000001b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000f461a402a662dde21478c2764549d609000000000000000000000000aa2f597552dc6350195995f4845b882f81d4122f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000644abacc000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000240518596b5c5f5e59c0b465fbc2c7ff2ea1683e3ddae9e604fb147908196cfb22b514eaa76220bcbab5196d6608ecdc16d2c62ed6463ba9716f89ac7ac3a48780b000000000000000000000000000000000000000000000000000000000000001b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000067d9417c9c3c250f61a83c7e8658dac487b56b09000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc100002aa983b889bdac6849ec240cdc2a259d350c26f67df7642ad75887a315786410000000000000000000000000f849de01b080adc3a814fabe1e2087475cf2e3540000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000067d9417c9c3c250f61a83c7e8658dac487b56b090000000000000000000000000000000000000000000000000000000000001b8f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000001388000000000000000000000000d823c605807cc5e6bd6fc0d7e4eea50d3e2d66cd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

        // await alice.sendTransaction({
        //     to: "0x67d9417c9c3c250f61a83c7e8658dac487b56b09",
        //     data: data
        // })

        // console.log(
        //     "after execute taker nft balance:",
        //     await nft.balanceOf(alice._address)
        // );
    });
});
