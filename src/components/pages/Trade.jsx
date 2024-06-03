import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Trade.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

const contractAddress = '0x567ABFA3312A6619f34549920Dc65e3cd78bB4a1'; // company nft

function Trading({ account }) {
    const [buyNft, setBuyNft] = useState([]);
    const [sellNft, setSellNft] = useState([]);
    const [activeTab, setActiveTab] = useState('buy');
    const [messageToOwner, setMessageToOwner] = useState([]);

    const calculateTimeLeft = (duration, dateReleased) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const secondsInDay = 86400; // 24 * 60 * 60
        const daysPassed = Math.floor((currentTimestamp - dateReleased) / secondsInDay);
        return duration - daysPassed;
    };

    const fetchBuyNft = async () => {
        console.log("Fetching");
        setActiveTab('buy');
        try {
            // Connect to Ethereum provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            //const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
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
                        Desc: nftInfo.Desc,
                        price: ethers.utils.formatEther(nftInfo.price),
                        duration: calculateTimeLeft(nftInfo.Duration, nftInfo.DateReleased),
                        image: nftInfo.NftImage,
                        adImg: nftInfo.AddImage,
                        msgToOwner: nftInfo.MessageFromOwner
                    });
                }
            }

            // console.log(nftList);
            // console.log(nftList.length);
            const newArray = new Array(nftList.length).fill('');
            setMessageToOwner(newArray);
            // console.log("final " , newArray);

            setBuyNft(nftList);
            console.log("nftlis ke baad ka");
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };

    const buyNftClicked = async (tokenId) => {
        console.log("Buy clicked");
        try {
            // Connect to Ethereum provider
            console.log(tokenId);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            //const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);


            // const formattedPrice = ethers.utils.parseUnits(price.toString(), 'ether');
            // console.log(formattedPrice);

            // Call the buyNFT function from the smart contract
            const tx = await contract.buyNFT(tokenId,"msg To Owner");

            // Wait for the transaction to be mined
            await tx.wait();

            setBuyNft((prev) => prev.filter((item) => item.tokenId !== tokenId));
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
            //const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, provider);

            // Fetch NFT count

            const nftCount = await contract.nextTokenId();

            // Fetch NFTs
            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                if (nftInfo.owner.toLowerCase() === account) {
                    console.log(nftInfo.owner);
                    nftList.push({
                        tokenId: i,
                        name: nftInfo.name,
                        Desc: nftInfo.Desc,
                        price: ethers.utils.formatEther(nftInfo.price),
                        duration: calculateTimeLeft(nftInfo.Duration, nftInfo.DateReleased),
                        image: nftInfo.NftImage,
                        adImg: nftInfo.AddImage,
                        msgToOwner: nftInfo.MessageToOwner
                    });
                }
            }
            
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
            //const contractAddress = '0x03dafb3618dAf48CeC9Ae0A419fa0F3E7A62a002'; // Contract address
            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);


            // const formattedPrice = ethers.utils.parseUnits(price.toString(), 'ether');
            // console.log(formattedPrice);

            // Call the buyNFT function from the smart contract
            const tx = await contract.sellNFT(tokenId);

            // Wait for the transaction to be mined
            await tx.wait();

            setSellNft((prev) => prev.filter((item) => item.tokenId !== tokenId));
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
            {account !== '0x0' ? (activeTab === 'buy' ? (
                buyNft.length > 0 ? (
                    <div className='wholeNftsDetails'>
                        {buyNft.map((item, idx) => (
                            <div key={item.tokenId} className='nftWrapper'>
                                <div className='nftDetail'>
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
                                        <p>{item.MessageFromOwner}</p>
                                        <input
                                            type="text"
                                            placeholder='Enter the message asked by the NFT distributor. Else you will not get NFT deleiverable'
                                            value={messageToOwner[idx] ? messageToOwner[idx] : ''} // Check for undefined
                                            onChange={(e) => setMessageToOwner((prev) => {
                                                console.log(idx);
                                                const masg = e.target.value;
                                                console.log(masg);
                                                const updatedMessage = [...prev];
                                                console.log("the updated mmsg" , updatedMessage);
                                                updatedMessage[idx] = e.target.value;
                                                return updatedMessage;
                                            })}
                                        />
                                    </div>
                                </div>
                                <button onClick={() => buyNftClicked(item.tokenId)}>Buy rNFT</button>
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
                            <div key={item.tokenId} className='nftWrapper'>
                                <div className='nftDetail'>
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
                                <button onClick={() => sellNftClick(item.tokenId)}>Sell NFT</button>
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
