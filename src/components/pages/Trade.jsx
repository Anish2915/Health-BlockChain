import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Trade.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Trade() {
    const [nft, setNft] = useState([]);

    const fetchNfts = async () => {
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
        console.log('Fetching NFTs to sell.')
    }

    return (
        <section>
            <nav>
                <ul>
                    <button onClick={fetchNfts}>Fetch Names of nft</button>
                    <li onClick={fetchSellNft}>Sell NFT</li>
                </ul>
            </nav>
            {nft.length > 0 ? (
                <div>
                    {nft.map((item, index) => (
                        <Link key={index} to={`/nft/${item.name}`}>
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>{item.price}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <h2>No NFTs available</h2>
            )}
        </section>
    )
}

export default Trade;