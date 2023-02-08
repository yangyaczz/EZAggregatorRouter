// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {RouterImmutables} from "../base/RouterImmutables.sol";
import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {ERC1155} from "solmate/src/tokens/ERC1155.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";
import "hardhat/console.sol";

abstract contract HandleSeaport is RouterImmutables {
    using SafeTransferLib for ERC20;
    using SafeTransferLib for address;
    address constant Native_Token = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    struct SeaportListStruct {
        address tokenAddress;
        uint256 tokenValue;
        bytes inputDate;
        uint256 nftStandard;
        address nftAddress;
        uint256 nftTokenId;
        uint256 nftAmount;
    }

    struct SeaportListStructSell {
        bytes inputDate;
        uint256 nftStandard;
        address nftAddress;
        uint256 nftTokenId;
        uint256 nftAmount;
    }

    /// @notice sell NFT
    /// @param seaportLists data about list
    function handleSeaportSell(
        SeaportListStructSell[] memory seaportLists
    ) internal returns (bool success, bytes memory output) {
        for (uint256 i; i < seaportLists.length; ) {
            SeaportListStructSell memory seaportList = seaportLists[i];

            if (seaportList.nftStandard == 721) {
                ERC721 _nft = ERC721(seaportList.nftAddress);
                _nft.safeTransferFrom(
                    msg.sender,
                    address(this),
                    seaportList.nftTokenId
                );
                _nft.setApprovalForAll(SEAPORT, true);
            } else if (seaportList.nftStandard == 1155) {
                ERC1155 _nft = ERC1155(seaportList.nftAddress);
                _nft.safeTransferFrom(
                    msg.sender,
                    address(this),
                    seaportList.nftTokenId,
                    seaportList.nftAmount,
                    new bytes(0)
                );
                _nft.setApprovalForAll(SEAPORT, true);
            } else {
                revert("HandleSeaport: nftStandard Error");
            }
            (success, output) = SEAPORT.call(seaportList.inputDate);
            
            unchecked {
                ++i;
            }
        }
    }
}
