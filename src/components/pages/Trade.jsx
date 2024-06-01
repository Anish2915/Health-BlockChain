import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Trade.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Trade() {
    const [buyNft, setBuyNft] = useState([]);
    const [sellNft, setSellNft] = useState([]);
    const [activeTab, setActiveTab] = useState('buy');

    const fetchBuyNfts = async () => {
        setActiveTab('buy');
        try {
            // Connect to Ethereum provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contractAddress = '0xFb7865EA41c4F5deeAeCe43335dA565a614CC035'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, provider);

            // Fetch NFT count
            const nftCount = await contract.nextTokenId();

            // Fetch NFTs
            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                nftList.push({
                    tokenId: i,
                    name: nftInfo.name,
                    duration: nftInfo.duration,
                    price: ethers.utils.formatEther(nftInfo.price)
                });
            }

            console.log(nftList);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };

    const fetchSellNft = async () => {
        setActiveTab('sell');
    }

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
            {account !== '0x0' ? (activeTab === 'buy' ? (
                buyNft.length > 0 ? (
                    <div>
                        {buyNft.map((item, index) => (
                            <Link key={index} to={`/nft/${item.name}`}>
                                <img src={item.image} alt={item.name} />
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>{item.price}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <h2>No NFts to buy.</h2>
                )
            ) : (
                sellNft.length > 0 ? (
                    <div>
                        {sellNft.map((item, index) => (
                            <Link key={index} to={`/nft/${item.name}`}>
                                <img src={item.image} alt={item.name} />
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>{item.price}</p>
                            </Link>
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

export default Trade;
