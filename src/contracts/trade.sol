// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.19 <0.9.0;

// import "./CompanyNFThandle.sol";
// import "./RWD.sol";

// contract Trade {
//     CompanyNFT public companyNFT;
//     RWD public rewardToken;

//     // Mapping to store NFT owner addresses
//     mapping(uint256 => address) public nftOwners;

//     constructor(address _companyNFT, address _rewardToken) {
//         companyNFT = CompanyNFT(_companyNFT);
//         rewardToken = RWD(_rewardToken);
//     }

//     // Function to buy an NFT
//     function buyNFT(uint256 tokenId, uint256 price) external {
//         // require(companyNFT.ownerOf(tokenId) == address(companyNFT), "NFT not released yet");
//         // require(nftOwners[tokenId] == address(0), "NFT already bought");
//         // require(rewardToken.balanceOf(msg.sender) >= price, "Insufficient funds");

//         // Transfer reward tokens to company that released the NFT
//         //(address payable companyAddress, string memory name) = companyNFT.companies(companyNFT.ownerOf(tokenId));
//         //rewardToken.transferFrom(msg.sender, companyAddress, price);

//         //nftOwners[tokenId] = msg.sender;
//         //companyNFT.updateNFTStatus(tokenId, true); // Update NFT ownership status
//     }

//     // Function to un-buy (refund) an NFT
//     function refundNFT(uint256 tokenId) public {
//         require(nftOwners[tokenId] == msg.sender, "Not the owner");

//         (string memory name, uint256 duration, uint256 price, bool isOwned, uint256 popularityIndex, uint256 creationTime) = companyNFT.nfts(tokenId);
//         uint256 elapsedTime = block.timestamp - creationTime; // Assuming creationTime is set during releaseNFT

//         // Calculate refund based on remaining duration (pro-rated)
//         uint256 refundAmount = price * (duration - elapsedTime) / duration;

//         // Transfer reward tokens back to user (minus potential fees)
//         rewardToken.transfer(msg.sender, refundAmount);

//         nftOwners[tokenId] = address(0);
//         //companyNFT.updateNFTStatus(tokenId, false); // Update NFT ownership status
//     }

//     // Function to increase popularity index from CompanyNFT contract
//     function impression(uint256 tokenId) public {
//         companyNFT.impression(tokenId);
//     }

//     // Function to calculate dynamic price based on popularity index (example)
//     function calculatePrice(uint256 tokenId) public view returns (uint256) {
//         (string memory name, uint256 duration, uint256 price, bool isOwned, uint256 popularityIndex, uint256 creationTime) = companyNFT.nfts(tokenId);
//         uint256 dynamicPrice = price + (popularityIndex * 10**15); // Adjust coefficient (10^15) as needed
//         return dynamicPrice;
//     }
// }
