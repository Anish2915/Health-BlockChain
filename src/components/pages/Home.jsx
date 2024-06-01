import React, { useState, useRef ,useEffect } from 'react';
import { BsEmojiLaughingFill } from "react-icons/bs";
import { FaCalendarAlt, FaShoppingBag, FaChartLine } from 'react-icons/fa';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

// Importing styles
import '../styles/Home.css';

// Importing comp
import Card from '../comp/Card';

function Home({ account, setAccount }) {
    const [imageToJudge, setImageToJudge] = useState(null);
    const [docToJudge, setDocToJudge] = useState(null);
    const [activeSection, setActiveSection] = useState('mybmi');
    const imageRef = useRef(null);
    const docRef = useRef(null);

    const handleImgClick = () => {
        imageRef.current.click();
    }

    const handleDocClick = () => {
        docRef.current.click();
    }

    const handleImageChange = async (e) => {
        if (account === '0x0') {
            await handleWalletConnection();
        }
        setImageToJudge(e.target.files[0]);
    }

    const handleDocChange = async (e) => {
        if (account === '0x0') {
            await handleWalletConnection();
        }
        setDocToJudge(e.target.files[0]);
    }

    const handleWalletConnection = async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } else {
            console.log('Please install MetaMask!')
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (account === '0x0') {
            await handleWalletConnection();
        }

        const formData = new FormData();
        formData.append('image', imageToJudge);
        formData.append('doc', docToJudge);
    }

    const [rwdBalance, setRwdBalance] = useState(0);

    useEffect(() => {
        if (account !== '0x0') {
            fetchRwdBalance(); // Fetch RWD balance when the account changes
        }
    }, [account]); // Dependency array to watch for changes in account

    const fetchRwdBalance = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const rwdContractAddress = '0x3AD56B29f3f2b9BF0912cD821121874b1fec7255'; // Replace with actual RWD token contract address
            const rwdContractAbi = ['function balanceOf(address) view returns (uint256)']; // ABI for balanceOf function
            const rwdContract = new ethers.Contract(rwdContractAddress, rwdContractAbi, provider);

            const balance = await rwdContract.balanceOf(account);
            setRwdBalance(ethers.utils.formatUnits(balance, 'ether'));
        } catch (error) {
            console.error('Error fetching RWD balance:', error);
        }
    };

    return (
        <section className='Home'>
            <form onSubmit={handleFormSubmit}>
                <div className="container">
                    <input
                        ref={imageRef}
                        type="file"
                        onChange={handleImageChange}
                        allowed="image/*"
                        className='imageInput'
                    />
                    <button onClick={handleImgClick} className='green'>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Upload your Image
                    </button>
                    <input
                        ref={docRef}
                        type="file"
                        onChange={handleDocChange}
                        allowed='application/pdf'
                        className='docInput'
                    />
                    <button onClick={handleDocClick} className='pink'>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Upload you BMI
                    </button>
                </div>
                <button type='submit' className="button blue">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </button>
            </form>

            {account !== '0x0' ? <div id="profile">
                <div className='greeting'>Hi, {account} &nbsp; <BsEmojiLaughingFill /></div>
                <div className="profileInsight">
                    <Card
                        title={`BMI: ${"24.5"}`}                                                    // To be replaced
                        cardImg="https://cdn-icons-png.flaticon.com/512/10476/10476452.png"
                        cardText={`${"Your BMI is 24.5. You are in the normal range."}`}            // To be replaced
                        className='card'
                    />
                    <Card
                        title={`RWD: ${rwdBalance}`}                                                                    // To be changed
                        cardImg="./RWDtoken.png"
                        cardText={`${"Your current balance of RWD is 0.5. Be healthier to earn more rewards."}`}  // To be changed
                        className='card'
                    />
                </div>

                <nav className="navbar">
                    <NavItem
                        icon={<FaCalendarAlt />}
                        label="My BMI"
                        isActive={activeSection === 'mybmi'}
                        onClick={() => setActiveSection('mybmi')}
                        className='navbarItem'
                    />
                    <NavItem
                        icon={<FaShoppingBag />}
                        label="My Reward Tokens"
                        isActive={activeSection === 'rwd'}
                        onClick={() => setActiveSection('rwd')}
                        className='navbarItem'
                    />
                    <NavItem
                        icon={<FaChartLine />}
                        label="My NFTs"
                        isActive={activeSection === 'nft'}
                        onClick={() => setActiveSection('nft')}
                        className='navbarItem'
                    />
                </nav>
                <div className="contentOfUser">
                    {activeSection === 'mybmi' && (
                        <div className="bmi-content">
                            <h1>BMI</h1>
                            <p>Your BMI is 24.5. You are in the normal range.</p>
                        </div>
                    )}
                    {activeSection === 'rwd' && (
                        <div className="rwd-content">
                            <h1>Reward Tokens</h1>
                            <p>Your current balance of RWD is 0.5. Be healthier to earn more rewards.</p>
                        </div>
                    )}
                    {activeSection === 'nft' && (
                        <div className="nft-content">
                            <h1>NFTs</h1>
                            <p>You have no NFTs yet. Keep working hard to earn them.</p>
                        </div>
                    )}
                </div>
            </div> : <div id="profile">
                <div className="greeting">Please login i.e. connect to MetaMask to continue!</div>
            </div>}
        </section>
    )
}

const NavItem = ({ icon, label, isActive, onClick }) => {
    return (
        <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className="icon">{icon}</div>
            <span className="label">{label}</span>
            {isActive && <span className="active-dot"></span>}
        </div>
    );
};

export default Home;