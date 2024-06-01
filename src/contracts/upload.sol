// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Upload is Ownable {
    IERC20 public rwdToken;
    address public rwdTokenDeployer;

    struct User {
        uint dateOfBirth;
        uint monthOfBirth;
        uint yearOfBirth;
        string gender;
        uint256[] bmiHistory;
    }

    mapping(address => User) public users;
    mapping(address => bool) public registeredUsers;

    uint256 constant HEALTHY_BMI_MIN = 18500;
    uint256 constant HEALTHY_BMI_MAX = 24900;
    uint256 constant REWARD_AMOUNT = 1 * (10 ** 18); // 1 RWD token

    event UserRegistered(address indexed user, uint date, uint month, uint year, string gender);
    event BMIRecorded(address indexed user, uint bmi);
    event RewardGiven(address indexed user, uint amount);

    constructor(IERC20 _rwdToken, address _rwdTokenDeployer) Ownable(msg.sender) {
        rwdToken = _rwdToken;
        rwdTokenDeployer = _rwdTokenDeployer;
    }

    function login(uint date, uint month, uint year, string memory gender) public {
        require(!registeredUsers[msg.sender], "User already registered");

        users[msg.sender].dateOfBirth = date;
        users[msg.sender].monthOfBirth = month;
        users[msg.sender].yearOfBirth = year;
        users[msg.sender].gender = gender;
        registeredUsers[msg.sender] = true;

        emit UserRegistered(msg.sender, date, month, year, gender);
    }

    // BMI is a multiple of 10^3
    function recordBMI(uint256 bmi) public {
        require(registeredUsers[msg.sender], "User not registered");

        User storage user = users[msg.sender];
        user.bmiHistory.push(bmi);

        emit BMIRecorded(msg.sender, bmi);

        if (user.bmiHistory.length > 1) {
            uint previousBMI = user.bmiHistory[user.bmiHistory.length - 2];
            if (bmi >= HEALTHY_BMI_MIN && bmi <= HEALTHY_BMI_MAX) {
                if (previousBMI <= HEALTHY_BMI_MIN || previousBMI >= HEALTHY_BMI_MAX) {
                    uint256 amount = REWARD_AMOUNT * 2;
                    _rewardUser(msg.sender, amount);
                } else {
                    _rewardUser(msg.sender, REWARD_AMOUNT);
                }
            } else if (bmi > previousBMI && bmi <= HEALTHY_BMI_MIN) {
                uint256 amount = (bmi - previousBMI) * (10 ** 15) + REWARD_AMOUNT;
                _rewardUser(msg.sender, amount);
            } else if (bmi < previousBMI && bmi >= HEALTHY_BMI_MAX) {
                uint256 amount = (previousBMI - bmi) * (10 ** 15) + REWARD_AMOUNT;
                _rewardUser(msg.sender, amount);
            }
        }
    }

    function _rewardUser(address user, uint256 _amount) internal {
        require(rwdToken.transferFrom(rwdTokenDeployer, user, _amount), "Reward transfer failed");
        emit RewardGiven(user, _amount);
    }

    function getBMIs(address user) public view returns (uint[] memory) {
        return users[user].bmiHistory;
    }
}
