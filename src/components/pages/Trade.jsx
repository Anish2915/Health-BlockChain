import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Trade.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Trading({ account }) {
    const [buyNft, setBuyNft] = useState([]);
    const [sellNft, setSellNft] = useState([]);
    const [activeTab, setActiveTab] = useState('buy');

    const fetchBuyNft = async () => {
        setActiveTab('buy');
        try {
            // Connect to Ethereum provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, provider);

            // Fetch NFT count
            
            const nftCount = await contract.nextTokenId();

            // Fetch NFTs
            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                //if(nftInfo.CurrentlyUnder == false){
                nftList.push({
                    tokenId: i,
                    name: nftInfo.name,
                    // duration: nftInfo.duration,
                    price: ethers.utils.formatEther(nftInfo.price)
                });
            //}
            }

            console.log(nftList);
            setBuyNft(nftList);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };

    const buyNftClick = async (tokenId) => {
        try {
            // Connect to Ethereum provider
            console.log(tokenId);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);

            
            // const formattedPrice = ethers.utils.parseUnits(price.toString(), 'ether');
            // console.log(formattedPrice);
    
            // Call the buyNFT function from the smart contract
            const tx = await contract.buyNFT(tokenId);
            
            // Wait for the transaction to be mined
            await tx.wait();
    
            console.log('NFT purchased successfully', tx);
        } catch (error) {
            console.error('Error purchasing NFT:', error);
        }
    };

    const fetchSellNft = async () => {
        setActiveTab('sell');
        try {
            // Connect to Ethereum provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, provider);

            // Fetch NFT count
            
            const nftCount = await contract.nextTokenId();

            // Fetch NFTs
            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                if(nftInfo.owner.toLowerCase() === account){
                nftList.push({
                    tokenId: i,
                    name: nftInfo.name,
                    // duration: nftInfo.duration,
                    price: ethers.utils.formatEther(nftInfo.price)
                });
            }
            }

            console.log(nftList);
            setSellNft(nftList);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    }

    const SellNftClick = async (tokenId) => {
        try {
            // Connect to Ethereum provider
            console.log(tokenId);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);

            
            // const formattedPrice = ethers.utils.parseUnits(price.toString(), 'ether');
            // console.log(formattedPrice);
    
            // Call the buyNFT function from the smart contract
            const tx = await contract.sellNFT(tokenId);
            
            // Wait for the transaction to be mined
            await tx.wait();
    
            console.log('NFT purchased successfully', tx);
        } catch (error) {
            console.error('Error purchasing NFT:', error);
        }
    };


    const activeLink = (tab) => {
        if (tab === activeTab) {
            return 'active';
        } else {
            return '';
        }
    }

    return (
        <section className='Trade'>
            <nav>
                <ul>
                    <li onClick={fetchBuyNft} className={activeLink('buy')}>Buy NFT</li>
                    <li onClick={fetchSellNft} className={activeLink('sell')}>Sell NFT</li>
                </ul>
            </nav>
            {true ? (activeTab === 'buy' ? (
                buyNft.length > 0 ? (
                    <div>
                        {buyNft.map((item, index) => (
                            <div>
                            <Link key={index} to={`/nft/${item.name}`}>
                                <img src={item.image} alt={item.name} />
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>{item.price}</p>
                            </Link>
                            <button onClick={() => buyNftClick(item.tokenId)}>Buy NFT</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2>No NFts to buy.</h2>
                )
            ) : (
                sellNft.length > 0 ? (
                    <div>
                        {sellNft.map((item, index) => (
                            <div>
                            <Link key={index} to={`/nft/${item.name}`}>
                                <img src={item.image} alt={item.name} />
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>{item.price}</p>
                            </Link>
                            <button onClick={() => SellNftClick(item.tokenId)}>Sell NFT</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2>No NFTs to sell!</h2>
                )
            )) : (
                <h2 className='warning'>To trade to NFTs, please connect to the MetaMask Wallet.</h2>
            )}
        </section>
    )
}

export default Trading;
