import React, { useState, useRef, useEffect } from 'react';
import { BsEmojiLaughingFill } from "react-icons/bs";
import { FaCalendarAlt, FaShoppingBag, FaChartLine } from 'react-icons/fa';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import axios from 'axios';

// Importing styles
import '../styles/Home.css';

// Importing comp
import Card from '../comp/Card';
import Upload from '../../truffle_abis/Upload.json'
const RewardAddress = '0x22aE45c5a2cA565d8dbED925E60197B1c68aA160';
const UploadAddress = '0xbEDaF514218102d3723D9BecB358Ac7B324E9c75';

function Home({ account, setAccount }) {
    const [imageToJudge, setImageToJudge] = useState(null);
    const [docToJudge, setDocToJudge] = useState(null);
    const [activeSection, setActiveSection] = useState('mybmi');
    const [rwdBalance, setRwdBalance] = useState(0);
    const [LastBmiVar, SetLastBmi] = useState(0);
    const [heightCm, setHeightCm] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const imageRef = useRef(null);
    const docRef = useRef(null);

    const [contract, setContract] = useState(null);

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

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', imageToJudge);
            formData.append('doc', docToJudge);
            formData.append('height', heightCm);

            const response = await axios.post('http://127.0.0.1:8000/user/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                const data = await response.data;
                console.log(data);
                // Send this data to backend of solidity for validation
                UploadDataLast(data.bmi);
            } else {
                setError(`Error in validating data: ${response.data.error}`)
            }
        } catch (error) {
            setError(`Error in validating data: ${error.message}`)
        } finally {
            setLoading(false);
            // setImageToJudge(null);
            // setDocToJudge(null);
        }
    }


    useEffect(() => {
        if (account !== '0x0') {
            fetchRwdBalance();
            GetLastBmi(); // Fetch RWD balance when the account changes
        }
    }, [account]); // Dependency array to watch for changes in account

    const fetchRwdBalance = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const rwdContractAddress = RewardAddress; // Replace with actual RWD token contract address
            const rwdContractAbi = ['function balanceOf(address) view returns (uint256)']; // ABI for balanceOf function
            const rwdContract = new ethers.Contract(rwdContractAddress, rwdContractAbi, provider);

            const balance = await rwdContract.balanceOf(account);
            setRwdBalance(ethers.utils.formatUnits(balance, 'ether'));
        } catch (error) {
            console.error('Error fetching RWD balance:', error);
        }
    };

    const GetLastBmi = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractt = new ethers.Contract(UploadAddress, Upload.abi, provider);

        const bmiHistory = await contractt.getBMIs(account);

        // Get the last uploaded BMI (assuming the array is not empty)
        const lastBMI = bmiHistory[bmiHistory.length - 1];

        if (lastBMI) {
            console.log('Last uploaded BMI:', lastBMI.toString());

            if (bmiHistory.length > 0) {
                SetLastBmi(parseFloat(lastBMI.toString()) / 1000);
            }
        }
    }

    const initEthers = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(UploadAddress, Upload.abi, signer);
        setContract(contract);
    };

    const LoginUserEnd = async (date, month, year, gender) => {
        try {

            await initEthers();

            const tx = await contract.login(date, month, year, gender);
            await tx.wait();
            console.log("User logged in:", tx);
        } catch (error) {
            console.error("Error logging in user:", error);
        }
    };

    const UploadDataLast = async (bmi) => {
        try {

            await initEthers();

            const tx = await contract.recordBMI(bmi);
            await tx.wait();
            console.log("BMI uploaded:", tx);
        } catch (error) {
            console.error("Error uploading BMI:", error);
        }
    };

    return (
        <section className='Home'>
            <form onSubmit={handleFormSubmit}>
                <div className="container">
                    <input
                        type="text"
                        placeholder='Enter your height in cm'
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        required
                    />
                    <input
                        ref={imageRef}
                        type="file"
                        onChange={handleImageChange}
                        allowed="image/*"
                        className='imageInput'
                        required
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
                        allowed='.pdf'
                        className='docInput'
                        required
                    />
                    <button onClick={handleDocClick} className='pink'>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Upload you BMI
                    </button>
                </div>
                <button type='submit' className="button blue" disabled={loading}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>

            {error && <div className="error">{error}</div>}

            {account !== '0x0' ? <div id="profile">
                <div className='greeting'>Hi, {account} &nbsp; <BsEmojiLaughingFill /></div>
                <div className="profileInsight">

                    <Card
                        title={`BMI: ${LastBmiVar}`}                                                    // To be replaced
                        cardImg="https://cdn-icons-png.flaticon.com/512/10476/10476452.png"
                        cardText={`${"Your BMI is . You are in the normal range."}`}            // To be replaced
                        className='card'
                    />
                    <Card
                        title={`RWD: ${rwdBalance}`}                                                                    // To be changed
                        cardImg="./RWDtoken.png"
                        cardText={`${"Your current balance of RWD. Be healthier to earn more rewards."}`}  // To be changed
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