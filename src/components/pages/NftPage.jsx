import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Importing styles
import '../styles/NftPage.css';

function NftPage() {
    const { nftid } = useParams();
    const [nft, setNft] = useState({
        name: 'COC NFT',
        owner: '0x12365498798465',
        RealOwner: '0x98951394651321',
        duration: 30,
        description: 'This is a NFT for giving 30 COC gems per day.',
        msgFromOwner: 'Kindly give your COC ID in format: #64654dfg54d6fg',
        AddImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmTP62xXZgMKZOkuRQL0MBeAvxQiovegu6g&s',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmTP62xXZgMKZOkuRQL0MBeAvxQiovegu6g&s'
    });
    const [error, setError] = useState(null);

    const calculateTimeLeft = (duration, dateReleased) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const secondsInDay = 86400; // 24 * 60 * 60
        const daysPassed = Math.floor((currentTimestamp - dateReleased) / secondsInDay);
        return duration - daysPassed;
    };

    // useEffect(() => {
    //     const fetchNft = async () => {
    //         try {
    //             // Fetch NFT data
    //             const nftData = await fetch(`https://api.opensea.io/api/v1/assets?token_ids=${nftid}&asset_contract_address=0x495f947276749ce646f68ac8c248420045cb7b5e`);
    //             const nftJson = await nftData.json();
    //             console.log(nftJson);
    //             setNft(nftJson.assets[0]);
    //         } catch (error) {
    //             setError(`Error fetching NFT: ${error.message}`);
    //         }
    //     }

    //     fetchNft();
    // }, [nftid]);

    return (
        <section className='NftPage'>
            {error && <p className='error'>{error}</p>}

            <div className='headingOfNft'>
                <img src={nft.image_url} alt={nft.name} />
                <h1>{nft.name}</h1>
            </div>

            <div className="advertisement">
                <img src={nft.AddImage} alt="Addvertisement by the Company" />
            </div>

            <div className="detail">
                <div>
                    <h2>Owner:</h2>
                    <p>{nft.owner}</p>
                </div>
                <div>
                    <h2>Released by:</h2>
                    <p>{nft.RealOwner}</p>
                </div>
                <div>
                    <h2>Expiring In:</h2>
                    <p>{nft.duration} days</p>
                </div>
                <div className="descriptionOfNft">
                    <h2>Description</h2>
                    <p>{nft.description}</p>
                </div>
                <div className="messageFromOwner">
                    <h2>Distributer's message</h2>
                    <p>{nft.msgFromOwner}</p>
                </div>
            </div>
        </section>
    )
}

export default NftPage;