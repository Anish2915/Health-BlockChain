// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;

    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStacked;
    mapping(address => bool) public isStacked;

    constructor(RWD _rwd,Tether _tether) public{
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositTokens(uint _amount) public {
        require(_amount >0 ,'amount cannot be zero');

        tether.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        if(!hasStacked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStacked[msg.sender] = true;
        hasStacked[msg.sender] = true;
    }

}