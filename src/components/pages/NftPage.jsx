import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Importing styles
import '../styles/NftPage.css';

function NftPage() {
    const { nftid } = useParams();
    const [nft, setNft] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNft = async () => {
            try {
            // Fetch NFT data
            const nftData = await fetch(`https://api.opensea.io/api/v1/assets?token_ids=${nftid}&asset_contract_address=0x495f947276749ce646f68ac8c248420045cb7b5e`);
            const nftJson = await nftData.json();
            console.log(nftJson);
            setNft(nftJson.assets[0]);
            } catch (error) {
                setError(`Error fetching NFT: ${error.message}`);
            }
        }

        fetchNft();
    }, [nftid]);

    return (
        <section className='NftPage'>
            {error && <p>{error}</p>}

            <div className='headingOfNft'>
                <img src={nft.image_url} alt={nft.name} />
                <h1>{nft.name}</h1>
            </div>
            <div className="detail">
                <p>Owner: {nft.owner.user.username}</p>
                <p>Created: {nft.created_date}</p>
                <p>External Link: <a href={nft.external_link} target='_blank' rel='noreferrer'>{nft.external_link}</a></p>
                <p>Permalink: <a href={nft.permalink} target='_blank' rel='noreferrer'>{nft.permalink}</a></p>
                <p>{nft.description}</p>
            </div>

            <div className="purchaseList">
                <h2>Past transactions on {nft.name}</h2>
                <ul>
                    {nft.sell_orders.map((order, index) => (
                        <li key={index}>
                            <p>Price: {order.current_price}</p>
                            <p>Expires: {order.expires_at}</p>
                            <p>Maker: {order.maker.user.username}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default NftPage;