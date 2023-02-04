// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {RouterImmutables} from "../base/RouterImmutables.sol";
import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {ERC1155} from "solmate/src/tokens/ERC1155.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";

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

    /// @notice buy NFT
    /// @param seaportLists data about list
    function handleSeaportBuy(
        SeaportListStruct[] memory seaportLists
    ) internal returns (bool success, bytes memory output) {
        for (uint256 i; i < seaportLists.length; ) {
            SeaportListStruct memory seaportList = seaportLists[i];

            // call seaport
            if (seaportList.tokenAddress == Native_Token) {
                (success, output) = SEAPORT.call{value: seaportList.tokenValue}(
                    seaportList.inputDate
                );

                // handle fail
                if (!success) {
                    msg.sender.safeTransferETH(seaportList.tokenValue);
                }
            } else {
                ERC20 _token = ERC20(seaportList.tokenAddress);
                _token.safeTransferFrom(
                    msg.sender,
                    address(this),
                    seaportList.tokenValue
                );
                _token.safeApprove(SEAPORT, seaportList.tokenValue);
                (success, output) = SEAPORT.call(seaportList.inputDate);

                // handle fail
                if (!success) {
                    _token.safeTransfer(msg.sender, seaportList.tokenValue);
                }
            }

            // if call success, transfer nft back to user
            if (success) {
                if (seaportList.nftStandard == 721) {
                    ERC721 _nft = ERC721(seaportList.nftAddress);
                    _nft.safeTransferFrom(
                        address(this),
                        msg.sender,
                        seaportList.nftTokenId
                    );

                } else if (seaportList.nftStandard == 1155) {
                    ERC1155 _nft = ERC1155(seaportList.nftAddress);
                    _nft.safeTransferFrom(
                        address(this),
                        msg.sender,
                        seaportList.nftTokenId,
                        seaportList.nftAmount,
                        new bytes(0)
                    );
                } else {
                    revert("HandleSeaport: nftStandard Error");
                }
            }

            unchecked {
                ++i;
            }
        }
    }
}
