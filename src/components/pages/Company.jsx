import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Company.css';

// Importing contracts
import CompanyNFT from '../../truffle_abis/CompanyNFT.json';

function Company({ account }) {
    const [selfNft, setSelfNft] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [newNft, setNewNft] = useState({
        name: '',
        price: '',
        description: '',
        duration: '',
        nftImg: '',
        adImg: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

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
            fetchSelfNFTs();         // Call this function upon succesfully deploying an NFT
        } catch (error) {
            console.error('Error deploying NFT:', error);
        } finally {
            setNewNft({
                name: '',
                price: '',
                description: '',
                duration: '',
                nftImg: '',
                adImg: ''
            });
        }
    };

    const fetchSelfNFTs = async () => {         // Sent by copilot
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

            const nftCount = await contract.nextTokenId();

            const nftList = [];
            for (let i = 0; i < nftCount; i++) {
                const nftInfo = await contract.nfts(i);
                nftList.push({
                    tokenId: i,
                    name: nftInfo.name,
                    description: nftInfo.description,
                    price: ethers.utils.formatEther(nftInfo.price),
                    duration: nftInfo.duration,
                    image: nftInfo.image,
                    adImg: nftInfo.adImg
                });
            }

            setSelfNft(nftList);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    }

    useEffect(() => {
        const checkRegistration = async () => {
            try {
                setLoading(true);
                if (!window.ethereum) {
                    alert('MetaMask is not installed!');
                    return;
                }
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const contractAddress = '0x0836c013763A153814B62FCBcCabd4f2781F7d94';

                const contract = new ethers.Contract(contractAddress, CompanyNFT.abi, signer);

                const isRegistered = await contract.isRegistered();

                setIsRegistered(isRegistered);
            } catch (error) {
                setError(`Error while checking registration: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }

        checkRegistration();
    }, [account]);

    useEffect(() => {
        fetchSelfNFTs();
    }, [isRegistered, account]);

    return (
        <section className='Company'>
            {error && <p className='error'>{error}</p>}

            {account !== '0x0' ? (
                <> {isRegistered === false ? (
                    <form onSubmit={handleRegister} className='registrationForm'>
                        <input
                            type="text"
                            placeholder='Enter your company name'
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                        <button type='submit' disabled={loading}>{loading ? "Loading..." : "Confirm account via transact and Register"}</button>
                    </form>
                ) : (
                    <div className="nftFormFull">
                        <div className='NFTdeploy'>
                            <div className="currentNft">
                                <img src={newNft.nftImg !== '' ? `${newNft.nftImg}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSube11G25NB9kdT8V_-T5RdzJzi3deviJ4_g&s"} alt="Token Image" />
                                <p>{newNft.name}</p>
                                <p>{newNft.price === '' ? "" : `NFT price: ${newNft.price}`}</p>
                            </div>
                            <form onSubmit={handleDeployNft} className='nftDeployForm'>
                                <input
                                    type="text"
                                    placeholder='Enter NFT name'
                                    value={newNft.name}
                                    onChange={(e) => setNewNft({ ...newNft, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder='Enter NFT price in Reward Tokens [RWD] (1ETH = 1e18RWD)'
                                    value={newNft.price}
                                    onChange={(e) => setNewNft({ ...newNft, price: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder='Enter the description of the NFT'
                                    value={newNft.description}
                                    onChange={(e) => setNewNft({ ...newNft, description: e.target.value })}
                                    requierd
                                />
                                <input
                                    type="number"
                                    placeholder='Enter the number of months the NFT will be valid for'
                                    value={newNft.duration}
                                    onChange={(e) => setNewNft({ ...newNft, duration: e.target.value })}
                                    requried
                                />
                                <input
                                    type="text"
                                    placeholder='Enter the public URL of the NFT image'
                                    value={newNft.nftImg}
                                    onChange={(e) => setNewNft({ ...newNft, nftImg: e.target.value })}
                                    requried
                                />
                                <input
                                    type="text"
                                    placeholder='Enter the public URL of the advertisement (IMAGE ONLY)'
                                    value={newNft.adImg}
                                    onChange={(e) => setNewNft({ ...newNft, adImg: e.target.value })}
                                />
                                <button type='submit'>Deploy NFT</button>
                            </form>
                        </div>

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
                            <h2 className='warning'>No NFTs deployed yet</h2>
                        )}
                    </div>
                )} </>
            ) : (
                <h2 className="warning">Kindly connect to MetaMask to access all features.</h2>
            )}
        </section>
    )
}

export default Company;
