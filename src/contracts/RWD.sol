// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RWD is ERC20 {
    constructor(uint256 initialSupply) ERC20("Reward Token", "RWD") {
        _mint(msg.sender, initialSupply * (10**decimals())); // Mint initial supply with decimals consideration
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        //_approve(sender, msg.sender, allowance(sender,msg.sender) - amount); // Update allowance after transfer
        _transfer(sender, recipient, amount);
        return true;
    }
}