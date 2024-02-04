// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// https://uniswap.org/docs/v2/smart-contracts

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}