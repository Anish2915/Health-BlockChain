pragma solidity ^0.5.0;

contract Tether{
    string public name = 'Tether token';
    string public symbol = 'USDT';
    uint256 public totalSupply = 1000000000000000000000000 ; // one million tokens , because 1 token = 10^18 unit
    uint public decimals = 18;
}