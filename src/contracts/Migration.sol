// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Migration {
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted (){
        if(msg.sender == owner){
            _;
        }
    }

    function SetCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    function Upgrade(address newAddress) public restricted {
        Migration Upgraded = Migration(newAddress);
        Upgraded.SetCompleted(last_completed_migration);
    }

}