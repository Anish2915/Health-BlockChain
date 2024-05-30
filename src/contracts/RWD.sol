// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract RWD{
    string public name = 'Reward token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000 ; // one million tokens , because 1 token = 10^18 unit
    uint public decimals = 18;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

     event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    } 

    function transfer(address _to, uint256 _value) external returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }

    function approve(address _spender,uint256 _value) external returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    function transferFrom(address _from , address _to , uint256 _value) external returns (bool success){
        require(_value >= balanceOf[_from]);
        require(_value >= allowance[_from][msg.sender]);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from,_to,_value);
        return true;
    }
    
}