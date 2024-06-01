import React, { useState } from 'react';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Company.css';
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Company() {
    const [selfNft, setSelfNft] = useState([]);
    const [companyName, setCompanyName] = useState('');

    const handleRegister = async () => {
        try {
            if (!window.ethereum) {
                alert('MetaMask is not installed!');
                return;
            }
            setCompanyName("testComp");

            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94';

            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);

            const transaction = await contract.registerCompany(companyName);

            await transaction.wait();

            console.log('registed successful', transaction);
        } catch (error) {
            console.error('Error registering:', error);
        }
    }

    const handleDeployNft = async () => {
        try {
            if (!window.ethereum) {
                alert('MetaMask is not installed!');
                return;
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94';

            const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);

            const transaction = await contract.releaseNFT('NFT Name', 10);

            await transaction.wait();

            console.log('NFT deployed:', transaction);
        } catch (error) {
            console.error('Error deploying NFT:', error);
        }
    };

    return (
        
        <section  style={{ marginTop: '100px' }}> 
            <button onClick={handleRegister}>Register</button>
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
