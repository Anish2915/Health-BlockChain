// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompanyNFT is Ownable {
    IERC20 public rwdToken;
    address public rwdTokenDeployer;

    struct NFT {
        string name; //
        uint256 price; //
        address owner; 
        address RealOwner; 
        bool CurrentlyUnder; 
        string NftImage; //
        string AddImage; //
        string Desc; //
        uint256 Duration; //
    }

    mapping(address => bool) public registeredCompanies;
    NFT[] public nfts;

    event CompanyRegistered(address company, string name);
    event NFTReleased(address company, string name, uint256 price);
    event NFTBought(address buyer, string name, uint256 price, address owner);
    event NFTSold(address seller, string name, uint256 price, address buyer);

    constructor(IERC20 _rwdToken, address _rwdTokenDeployer) Ownable(msg.sender) {
    rwdToken = _rwdToken;
    rwdTokenDeployer = _rwdTokenDeployer;
}

    modifier onlyRegisteredCompany() {
        require(registeredCompanies[msg.sender], "You are not a registered company");
        _;
    }

    function registerCompany(string memory name) external {
        require(!registeredCompanies[msg.sender], "Company already registered");
        registeredCompanies[msg.sender] = true;
        emit CompanyRegistered(msg.sender, name);
    }

    function releaseNFT(string memory name, uint256 price) external onlyRegisteredCompany {
        require(price > 0, "Price must be greater than zero");
        nfts.push(NFT({
            name: name,
            price: price,
            owner: msg.sender,
            RealOwner: msg.sender,
            CurrentlyUnder: false
        }));
        emit NFTReleased(msg.sender, name, price);
    }

    function buyNFT(uint256 nftIndex) external {
        require(nftIndex < nfts.length, "NFT does not exist");
        NFT storage nft = nfts[nftIndex];
        require(nft.owner != msg.sender, "You already own this NFT");
        require(rwdToken.transferFrom(msg.sender, nft.owner, nft.price), "RWD transfer failed");

        nft.owner = msg.sender;
        nft.CurrentlyUnder = true;

        emit NFTBought(msg.sender, nft.name, nft.price, nft.owner);
    }

    function sellNFT(uint256 nftIndex) external {
        require(nftIndex < nfts.length, "NFT does not exist");
        NFT storage nft = nfts[nftIndex];
        require(nft.owner == msg.sender, "You can only sell your own NFT");

        require(rwdToken.transferFrom(rwdTokenDeployer, msg.sender, nft.price), "RWD transfer failed");
        nft.owner = rwdTokenDeployer;
        nft.CurrentlyUnder = false;
        emit NFTSold(msg.sender, nft.name, nft.price, rwdTokenDeployer);
    }

    function getNFTs() external view returns (NFT[] memory) {
        return nfts;
    }

    function getNFT(uint256 index) external view returns (NFT memory) {
        require(index < nfts.length, "NFT does not exist");
        return nfts[index];
    }

    function nextTokenId() external view returns (uint256) {
        return nfts.length;
    }
}
