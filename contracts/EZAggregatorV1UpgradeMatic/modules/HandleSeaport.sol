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
    address constant Native_Token = 0x0000000000000000000000000000000000000000;
    address constant Conduit = 0x1E0049783F008A0085193E00003D00cd54003c71;

    struct SeaportStruct {
        address tokenAddress;
        uint256 tokenValue;
        bytes inputDate;
        uint256 nftStandard;
        address nftAddress;
        uint256 nftTokenId;
        uint256 nftAmount;
    }

    function approveTokenToConduit(address token) internal {
        ERC20(token).safeApprove(Conduit, type(uint256).max);
    }

    /// @notice buy NFT
    /// @param seaportLists data about list
    function handleSeaportBuy(
        SeaportStruct[] memory seaportLists
    ) internal returns (bool success, bytes memory output) {
        for (uint256 i; i < seaportLists.length; ) {
            SeaportStruct memory seaportList = seaportLists[i];

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
                _token.safeApprove(Conduit, seaportList.tokenValue);
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

    /// @notice sell NFT
    /// @param seaportOffers data about list
    function handleSeaportSell(
        SeaportStruct[] memory seaportOffers
    ) internal returns (bool success, bytes memory output) {
        for (uint256 i; i < seaportOffers.length; ) {
            SeaportStruct memory seaportList = seaportOffers[i];

            // transfer nft to this contract
            if (seaportList.nftStandard == 721) {
                ERC721 _nft = ERC721(seaportList.nftAddress);
                _nft.safeTransferFrom(
                    msg.sender,
                    address(this),
                    seaportList.nftTokenId
                );
                _nft.setApprovalForAll(SEAPORT, true);

                // call seaport
                (success, output) = SEAPORT.call(seaportList.inputDate);

                // handle fail
                if (!success) {
                    _nft.safeTransferFrom(
                        address(this),
                        msg.sender,
                        seaportList.nftTokenId
                    );
                }
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

                // call seaport
                (success, output) = SEAPORT.call(seaportList.inputDate);

                // handle fail
                if (!success) {
                    _nft.safeTransferFrom(
                        msg.sender,
                        address(this),
                        seaportList.nftTokenId,
                        seaportList.nftAmount,
                        new bytes(0)
                    );
                }
            } else {
                revert("HandleSeaport: nftStandard Error");
            }

            // if call success, transfer token back to user
            if (success) {
                if (seaportList.tokenAddress == Native_Token) {
                    msg.sender.safeTransferETH(seaportList.tokenValue);
                } else {
                    ERC20 _token = ERC20(seaportList.tokenAddress);
                    _token.safeTransfer(msg.sender, seaportList.tokenValue);
                }
            }

            unchecked {
                ++i;
            }
        }
    }
}
