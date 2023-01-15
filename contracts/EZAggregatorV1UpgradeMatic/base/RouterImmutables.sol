// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import {IWETH9} from "../interfaces/IWETH9.sol";

struct RouterParameters {
    address weth9;
    address reservoir;
    address seaportModule;
    address ezswap;
}

/// @title Router Immutable Storage contract
/// @notice Used along with the `RouterParameters` struct for ease of cross-chain deployment
contract RouterImmutables {
    /// @dev WETH9 address
    IWETH9 internal WETH9;

    /// @dev Reservoir address
    address internal RESERVOIR;

    /// @dev SeaportModule address
    address internal SEAPORTMODULE;

    // @dev EZ's router address
    address internal EZSWAP;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(RouterParameters memory params) {
        WETH9 = IWETH9(params.weth9);
        RESERVOIR = params.reservoir;
        SEAPORTMODULE = params.seaportModule;
        EZSWAP = params.ezswap;
    }
}
