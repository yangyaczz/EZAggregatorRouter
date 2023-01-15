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

    // let blocknumber = 16390838
    // let nfttrader = "0xc36bd1d1e2cfce872464bf243b5062e7b97a50c3"
    // let nftAddress = "0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e"
    // let tokenid = 7980
    // let nftTokenId = "0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e:7980"


    let blocknumber = 16409863
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

    orders = orders.orders

    for (let i = 0; i < orders.length; i = i + 3) {

        it("sell nft through eoa" + i, async () => {


            let orderIdb = orders[i].id
            let kind = orders[i].kind


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
                    // console.log(i, "post error, orderId:", orderIdb, "kind:", kind)
                }
                );

            if (data == null) {
                console.log(i, "post error, orderId:", orderIdb, "kind:", kind)
                return
            }

            /////////////////////////////////////

            try {
                await alice.sendTransaction({
                    to: nftAddress,
                    data: data
                })

                let newOwner = await nft.ownerOf(tokenid)
                if (newOwner != alice._address) {
                    console.log(i, "success")
                } else {
                    console.log(i, "fail")
                }

            } catch {
                console.log(i, "call error, orderId:", orderIdb, "kind:", kind)
            }


        });

    }
});
