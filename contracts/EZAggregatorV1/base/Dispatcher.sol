// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {Payments} from "../modules/Payments.sol";
import {RouterImmutables} from "../base/RouterImmutables.sol";
import {Callbacks} from "../base/Callbacks.sol";
import {Commands} from "../libraries/Commands.sol";
import {Recipient} from "../libraries/Recipient.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {ERC1155} from "solmate/src/tokens/ERC1155.sol";

/// @title Decodes and Executes Commands
/// @notice Called by the UniversalRouter contract to efficiently decode and execute a singular command
abstract contract Dispatcher is Payments, Callbacks {
    using Recipient for address;

    error InvalidCommandType(uint256 commandType);
    error InvalidOwnerERC721();
    error InvalidOwnerERC1155();

    enum ReservoirOfferMarket {
        OPENSEA,
        LOOKSRARE,
        X2Y2
    }

    struct ReservoirOfferStruct {
        ReservoirOfferMarket offerMarket;
        uint256 tokenStandard;
        address collection;
        uint256 tokenId;
        uint256 tokenAmount;
        bytes inputDate;
        uint offerAmount;
    }

    function getOfferMarketAddress(
        ReservoirOfferMarket offerMarket
    ) internal view returns (address) {
        if (offerMarket == ReservoirOfferMarket.OPENSEA) {
            return SEAPORTMODULE; // SeaportModule
        } else if (offerMarket == ReservoirOfferMarket.LOOKSRARE) {
            return LOOKSRAREMODULE; // LooksRareModule
        } else if (offerMarket == ReservoirOfferMarket.X2Y2) {
            return X2Y2MODULE; // X2Y2Module
        } else {
            revert("OfferMarket Error");
        }
    }

    /// @notice Decodes and executes the given command with the given inputs
    /// @param commandType The command type to execute
    /// @param inputs The inputs to execute the command with
    /// @dev 2 masks are used to enable use of a nested-if statement in execution for efficiency reasons
    /// @return success True on success of the command, false on failure
    /// @return output The outputs or error messages, if any, from the command
    function dispatch(
        bytes1 commandType,
        bytes memory inputs
    ) internal returns (bool success, bytes memory output) {
        uint256 command = uint8(commandType & Commands.COMMAND_TYPE_MASK);

        success = true;

        if (command < 0x10) {
            // 0x00 <= command < 0x08
            if (command < 0x08) {
                if (command == Commands.reservoirBuy) {
                    (uint256 value, bytes memory data) = abi.decode(
                        inputs,
                        (uint256, bytes)
                    );

                    (success, output) = RESERVOIR.call{value: value}(data);
                    require(success, "buy call fail");
                } else if (command == Commands.reservoirSell) {
                    ReservoirOfferStruct[] memory reservoirOffers = abi.decode(
                        inputs,
                        (ReservoirOfferStruct[])
                    );

                    for (uint256 i; i < reservoirOffers.length; ) {
                        ReservoirOfferStruct
                            memory reservoirOffer = reservoirOffers[i];

                        if (reservoirOffer.tokenStandard == 721) {
                            uint256 beforeTransferBalance = WETH9.balanceOf(
                                address(this)
                            );
                            ERC721(reservoirOffer.collection).safeTransferFrom(
                                msg.sender,
                                getOfferMarketAddress(
                                    reservoirOffer.offerMarket
                                ),
                                reservoirOffer.tokenId,
                                reservoirOffer.inputDate
                            );
                            uint256 afterTransferBalance = WETH9.balanceOf(
                                address(this)
                            );
                            require(
                                afterTransferBalance - beforeTransferBalance ==
                                    reservoirOffer.offerAmount,
                                "OfferAmount Error"
                            );
                        } else if (reservoirOffer.tokenStandard == 1155) {
                            uint256 beforeTransferBalance = WETH9.balanceOf(
                                address(this)
                            );
                            ERC1155(reservoirOffer.collection).safeTransferFrom(
                                    msg.sender,
                                    getOfferMarketAddress(
                                        reservoirOffer.offerMarket
                                    ),
                                    reservoirOffer.tokenId,
                                    reservoirOffer.tokenAmount,
                                    reservoirOffer.inputDate
                                );
                            uint256 afterTransferBalance = WETH9.balanceOf(
                                address(this)
                            );
                            require(
                                afterTransferBalance - beforeTransferBalance ==
                                    reservoirOffer.offerAmount,
                                "OfferAmount Error"
                            );
                        } else {
                            revert("TokenStandard Error");
                        }

                        unchecked {
                            ++i;
                        }
                    }
                } else if (command == Commands.SWEEP) {
                    (address token, address recipient, uint256 amountMin) = abi
                        .decode(inputs, (address, address, uint256));
                    Payments.sweep(token, recipient.map(), amountMin);
                } else if (command == Commands.TRANSFER) {
                    (address token, address recipient, uint256 value) = abi
                        .decode(inputs, (address, address, uint256));
                    Payments.pay(token, recipient.map(), value);
                } else if (command == Commands.PAY_PORTION) {
                    (address token, address recipient, uint256 bips) = abi
                        .decode(inputs, (address, address, uint256));
                    Payments.payPortion(token, recipient.map(), bips);
                }
                // 0x08 <= command < 0x10
            } else {
                if (command == Commands.WRAP_ETH) {
                    (address recipient, uint256 amountMin) = abi.decode(
                        inputs,
                        (address, uint256)
                    );
                    Payments.wrapETH(recipient.map(), amountMin);
                } else if (command == Commands.UNWRAP_WETH) {
                    (address recipient, uint256 amountMin) = abi.decode(
                        inputs,
                        (address, uint256)
                    );
                    Payments.unwrapWETH9(recipient.map(), amountMin);
                }
            }
            // 0x10 <= command
        } else {
            // 0x10 <= command < 0x18
            if (command < 0x18) {
                if (command == Commands.SWEEP_ERC721) {
                    (address token, address recipient, uint256 id) = abi.decode(
                        inputs,
                        (address, address, uint256)
                    );
                    Payments.sweepERC721(token, recipient.map(), id);
                }
                // 0x18 <= command < 0x1f
            } else {
                if (command == Commands.SWEEP_ERC1155) {
                    (
                        address token,
                        address recipient,
                        uint256 id,
                        uint256 amount
                    ) = abi.decode(
                            inputs,
                            (address, address, uint256, uint256)
                        );
                    Payments.sweepERC1155(token, recipient.map(), id, amount);
                }
            }
        }
    }
}
