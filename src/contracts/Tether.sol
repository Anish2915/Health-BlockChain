// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Tether{
    string public name = 'Tether token';
    string public symbol = 'USDT';
    uint256 public totalSupply = 100000000000000000000000 ; // one million tokens , because 1 token = 10^18 unit
    uint public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint indexed _value
    );

    event Approve(
        address indexed _Owner,
        address indexed _Spender,
        uint indexed _value
    );

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    } 

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }

    function approve(address _spender,uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender,_spender,_value);
    }

    function transferFrom(address _from , address _to , uint256 _value) public returns (bool success){
        require(_value >= balanceOf[_from]);
        require(_value >= allowance[_from][msg.sender]);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from,_to,_value);
        return true;
    }
}