import React, { useState } from 'react';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Company.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Company() {
    const [selfNft, setSelfNft] = useState([]);

    const handleDeployNft = async () => {
        try {
            if (!window.ethereum) {
                alert('MetaMask is not installed!');
                return;
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contractAddress = '0xFb7865EA41c4F5deeAeCe43335dA565a614CC035';

            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);

            const transaction = await contract.releaseNFT('NFT Name', 10, ethers.utils.parseEther('0.1'));

            await transaction.wait();

            console.log('NFT deployed:', transaction);
        } catch (error) {
            console.error('Error deploying NFT:', error);
        }
    };

    return (
        <section>
            <button onClick={handleDeployNft}>Deploy</button>
            {selfNft.length > 0 ? (
                <div>
                    {selfNft.map((item, index) => (
                        <div key={index}>
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>{item.price}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <h2>No NFTs available</h2>
            )}
        </section>
    )
}

export default Company;
