// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CompanyNFT is ERC721 {
    struct Company {
        address payable companyAddress;
        string name;
    }

    mapping(address => Company) public companies;
    mapping(uint256 => CompanyNFT.NFTInfo) public nfts;
    mapping(address => uint256) public popularityIndex;
    address public tradeContract;
    uint256 public nextTokenId;

    event CompanyRegistered(address companyAddress, string name);
    event NFTReleased(address companyAddress, uint256 tokenId, string name, uint256 duration);
    event NFTBurned(uint256 tokenId);
    event ImpressionIncreased(address companyAddress, uint256 tokenId);

    struct NFTInfo {
        string name;
        uint256 duration;
        uint256 price;
        bool isOwned;
        uint256 popularityIndex;
        uint256 creationTime;
    }

    constructor(address _tradeContract) ERC721("CompanyName", "CNM") {
        tradeContract = _tradeContract;
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
        _mint(tradeContract, tokenId);

        nfts[tokenId] = NFTInfo(_name, _duration, _price, false, 0,block.timestamp);
        emit NFTReleased(msg.sender, tokenId, _name, _duration);
    }

    function burnNFT(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");

        _burn(tokenId);
        delete nfts[tokenId];
        emit NFTBurned(tokenId);
    }

    function impression(uint256 tokenId) external {
        require(ownerOf(tokenId) != address(0), "NFT does not exist");
        address companyAddress = companies[ownerOf(tokenId)].companyAddress;
        nfts[tokenId].popularityIndex++;
        emit ImpressionIncreased(companyAddress, tokenId);
    }
    
    function updateNFTStatus(uint256 tokenId, bool isOwned) external {
    require(msg.sender == tradeContract, "Unauthorized");
    nfts[tokenId].isOwned = isOwned;
}
}
