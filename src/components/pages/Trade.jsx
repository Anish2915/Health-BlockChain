import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Trade.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Trading({ account }) {
    const [buyNft, setBuyNft] = useState({});
    const [sellNft, setSellNft] = useState({});
    const [activeTab, setActiveTab] = useState('buy');
    const [messageToOwner, setMessageToOwner] = useState('');

    const fetchBuyNft = async () => {
        setActiveTab('buy');
        try {
            // Connect to Ethereum provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, provider);

            // Fetch NFT count

            const nftCount = await contract.nextTokenId();

            // Fetch NFTs
            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                if (nftInfo.CurrentlyUnder == false) {
                    nftList.push({
                        tokenId: i,
                        name: nftInfo.name,
                        // duration: nftInfo.duration,
                        price: ethers.utils.formatEther(nftInfo.price)
                    });
                }
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
            const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94'; // Contract address
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
            const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, provider);

            // Fetch NFT count

            const nftCount = await contract.nextTokenId();

            // Fetch NFTs
            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                if (nftInfo.owner.toLowerCase() === account) {
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
    };

    const sellNftClick = async (tokenId) => {
        try {
            // Connect to Ethereum provider
            console.log(tokenId);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94'; // Contract address
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

    const toggleDescriptiveDetails = (nftTokenId) => {
        const description = document.getElementById(nftTokenId);
        if (description) {
            if (description.style.display === 'flex') {
                description.style.display = 'none';
            } else {
                description.style.display = 'flex';
            }
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
                    <div className='wholeNftsDetails'>
                        {buyNft.map((item) => (
                            <div className='nftWrapper'>
                                <div key={item.tokenId} className='nftDetail'>
                                    <div className="essentialDetails" onClick={toggleDescriptiveDetails(item.tokenId)}>
                                        <div className="leftEssentialDetails">
                                            <img src={item.image} alt={item.name} />
                                            <Link to={`/nft/${item.tokenId}`}>{item.name}</Link>
                                            <p>{`RWD ${item.price}`}</p>
                                        </div>
                                        <p>{`${item.duration} days left`}</p>
                                    </div>
                                    <div className='description' id={item.tokenId}>
                                        <p>{item.Desc}</p>
                                        <p>{item.MessageFromOwner}</p>
                                        <input
                                            type="text"
                                            placeholder='Enter the message asked by the NFT distributor. Else you will not get NFT deleiverable'
                                            value={messageToOwner}
                                            onChange={(e) => setMessageToOwner(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button onClick={buyNftClick(item.tokenId)}>Buy NFT</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2 className='warning'>No NFts to buy.</h2>
                )
            ) : (
                sellNft.length > 0 ? (
                    <div className='wholeNftsDetails'>
                        {sellNft.map((item) => (
                            <div className='nftWrapper'>
                                <div key={item.tokenId} className='nftDetail'>
                                    <div className="essentialDetails" onClick={() => toggleDescriptiveDetails(item.tokenId)}>
                                        <div className="leftEssentialDetails">
                                            <img src={item.image} alt={item.name} />
                                            <Link to={`/nft/${item.tokenId}`}>{item.name}</Link>
                                            <p>{`RWD ${item.price}`}</p>
                                        </div>
                                        <p>{`${item.duration} days left`}</p>
                                    </div>
                                    <div className='description' id={item.tokenId}>
                                        <p>{item.Desc}</p>
                                    </div>
                                </div>
                                <button onClick={sellNftClick(item.tokenId)}>Sell NFT</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2 className='warning'>No NFTs to sell!</h2>
                )
            )) : (
                <h2 className='warning'>To trade to NFTs, please connect to the MetaMask Wallet.</h2>
            )}
        </section>
    )
}

export default Trading;
