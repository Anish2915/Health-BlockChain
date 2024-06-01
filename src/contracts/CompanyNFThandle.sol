// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "./RWD.sol";

contract CompanyNFT {
    struct Company {
        address payable companyAddress;
        string name;
    }

    struct NFT {
        address owner;
        string name;
        uint256 duration;
        uint256 price;
        bool isOwned;
        uint256 popularityIndex;
        uint256 creationTime;
    }

    mapping(address => Company) public companies;
    mapping(uint256 => NFT) public nfts;
    mapping(address => uint256) public popularityIndex;
    address public rewardToken;
    uint256 public nextTokenId;
    RWD public rwd;

    event CompanyRegistered(address companyAddress, string name);
    event NFTReleased(address companyAddress, uint256 tokenId, string name, uint256 duration, uint256 price);
    event NFTBurned(uint256 tokenId);
    event ImpressionIncreased(address companyAddress, uint256 tokenId);
    event NFTBought(address buyer, uint256 tokenId, uint256 price);

    constructor(RWD _rwd) {
        //rewardToken = _rewardToken;
        rwd = _rwd;
        nextTokenId = 0;
    }

    function registerCompany(string memory _name) public {
        require(companies[msg.sender].companyAddress == address(0), "Company already registered");
        companies[msg.sender] = Company(payable(msg.sender), _name);
        emit CompanyRegistered(msg.sender, _name);
    }

    function releaseNFT(string memory _name, uint256 _duration, uint256 _price) public {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        uint256 tokenId = nextTokenId; // Use the current value of nextTokenId
        nextTokenId++;
        
        nfts[tokenId] = NFT(msg.sender, _name, _duration, _price, false, 0, block.timestamp);
        emit NFTReleased(msg.sender, tokenId, _name, _duration, _price);
    }

    function burnNFT(uint256 tokenId) external {
        require(nfts[tokenId].owner == msg.sender, "Not the owner");
        require(!nfts[tokenId].isOwned, "NFT is owned");
        delete nfts[tokenId];
        emit NFTBurned(tokenId);
    }

    function impression(uint256 tokenId) external {
        require(nfts[tokenId].isOwned, "NFT is not owned");
        address companyAddress = companies[nfts[tokenId].owner].companyAddress;
        nfts[tokenId].popularityIndex++;
        emit ImpressionIncreased(companyAddress, tokenId);
    }

    function buyNFT(uint256 tokenId) external {
        NFT storage nft = nfts[tokenId];
        require(!nft.isOwned, "NFT is already owned");
        
        // Transfer RWD tokens from buyer to the company
        // require(RWD(rewardToken).transferFrom(msg.sender, companies[nft.owner].companyAddress, nft.price),
        //     "Transfer failed");
        
        // Update the NFT status
        uint256 dd = 1e18;
        rwd.transferFrom(msg.sender,companies[nft.owner].companyAddress, 0); 
        nft.owner = msg.sender;
        nft.isOwned = true;
        
        emit NFTBought(msg.sender, tokenId, nft.price);
    }
}
