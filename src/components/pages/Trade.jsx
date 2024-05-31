import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Importing styles
import '../styles/Trade.css';

function Trade() {
    const [nft, setNft] = useState([]);

    const fetchBuyNft = async () => {
        console.log('Fetching NFTs to buy.')
    }

    const fetchSellNft = async () => {
        console.log('Fetching NFTs to sell.')
    }

    return (
        <section>
            <nav>
                <ul>
                    <li onClick={fetchBuyNft}>Buy NFT</li>
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