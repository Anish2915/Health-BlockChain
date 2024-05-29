// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

// Import ERC721 standard for NFTs
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Import ERC20 interface for Reward token
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CompanyNFT is ERC721 {
    // Structure to store information about a company
    struct Company {
        address payable companyAddress;
        string name;
    }

    // Mapping to store companies by their address
    mapping(address => Company) public companies;

    // Mapping to store information about each NFT
    mapping(uint256 => NFTInfo) public nfts;

    // Mapping to track popularity index for each company (NFT purchases)
    mapping(address => uint256) public popularityIndex;

    // Address of the dApp currency (Reward token) - Replace with your token address
    address public rewardToken;

    // Event emitted when a new company registers
    event CompanyRegistered(address companyAddress, string name);

    // Event emitted when a new NFT is released
    event NFTReleased(
        address companyAddress,
        uint256 tokenId,
        string name,
        uint256 duration
    );

    // Event emitted when an NFT is burned
    event NFTBurned(uint256 tokenId);

    constructor(address _rewardToken) ERC721("CompanyName", "CNM") {
        rewardToken = _rewardToken;
    }

    // Function for company registration
    function registerCompany(string memory _name) public {
        require(
            companies[msg.sender].companyAddress == address(0),
            "Company already registered"
        );
        companies[msg.sender] = Company(payable(msg.sender), _name);
        emit CompanyRegistered(msg.sender, _name);
    }

    // Function for company to release a new NFT
    function releaseNFT(
        string memory _name,
        uint256 _duration,
        // bytes memory _data,
        uint256 _price
    ) public {
        require(
            companies[msg.sender].companyAddress != address(0),
            "Company not registered"
        );
        uint256 tokenId = balanceOf(address(this)); // Access total minted NFTs via balanceOf(this)
        _mint(msg.sender, tokenId);

        nfts[tokenId] = NFTInfo(
            _name,
            _duration,
            block.timestamp + _duration * 1 days,
            _price
        ); // Set burn timestamp
        emit NFTReleased(msg.sender, tokenId, _name, _duration);
    }

    // Function for user to purchase NFT (assuming Reward token integration)
    function buyNFT(uint256 tokenId) public {
        require(nfts[tokenId].burnTimestamp > block.timestamp, "NFT expired");
        NFTInfo memory nft = nfts[tokenId];
        require(
            IERC20(rewardToken).balanceOf(msg.sender) >= nft.price,
            "Insufficient Reward tokens"
        );
        IERC20(rewardToken).transferFrom(
            msg.sender,
            companies[ownerOf(tokenId)].companyAddress,
            nft.price
        ); // Transfer Reward tokens

        _transfer(ownerOf(tokenId), msg.sender, tokenId); // Transfer NFT ownership
        popularityIndex[companies[ownerOf(tokenId)].companyAddress]++; // Update popularity index
        emit NFTBurned(tokenId);
        delete nfts[tokenId]; // Remove NFT info after purchase
    }

    // Function for company to withdraw funds (implement access control here)
    function withdrawFunds() public {
        // Implement logic to check if company can withdraw and transfer funds to companyAddress
    }

    // (Optional) Function for company to update user data access consent
    function updateUserDataConsent(address user, bool consent) public {
        // Implement logic to update user data consent for the company
    }

    // Structure to store information about an NFT
    struct NFTInfo {
        string name;
        uint256 duration;
        uint256 burnTimestamp; // Timestamp when NFT burns
        uint256 price; // Price of the NFT in Reward tokens
    }
}
