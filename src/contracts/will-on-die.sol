// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

contract OnDie{
    address owner;
    uint MyEther;
    bool isDead;

    constructor() payable {
        owner = msg.sender;
        MyEther = msg.value;
        isDead = false;
    }

    modifier OnlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier MustBeDied {
        require(isDead == true);
        _;
    }

    address payable[] familyWallet;

    mapping (address => uint) Inheritance;

    function SetInheritance(address payable wallet , uint amount) public OnlyOwner {
        familyWallet.push(wallet);
        Inheritance[wallet] = amount;
    }

    function payout() private MustBeDied {
        for(uint i=0;i < familyWallet.length; i++){
            familyWallet[i].transfer(Inheritance[familyWallet[i]]);
        }
    }

    function died() public OnlyOwner{
        isDead = true;
        payout();
    }
    
}