import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Importing styles
import '../styles/Trade.css';

function Trade({ props, account }) {
    const [buyNft, setBuyNft] = useState([]);
    const [sellNft, setSellNft] = useState([]);
    const [activeTab, setActiveTab] = useState('buy');

    const fetchBuyNft = async () => {
        setActiveTab('buy');
    }

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