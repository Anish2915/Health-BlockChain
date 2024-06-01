import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import detectEthereumProvider from '@metamask/detect-provider';

// Importing styles
import '../styles/NavbarUser.css';

function NavbarUser({ account, setAccount }) {
    const [search, setSearch] = useState('');
    const location = useLocation();

    useEffect(() => {
        const handleAccountsChanged = async (accounts) => {
            if (accounts.length === 0) {
                console.log('Please connect to MetaMask!');
                setAccount('0x0')
            } else if (accounts[0] !== account) {
                setAccount(account[0]);
            }
        }

        const handleChainChanged = () => {
            window.location.reload();
        }

        const connectWallet = async () => {
            const provider = await detectEthereumProvider();
            if (provider) {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);

                window.ethereum.on('accountsChanged', handleAccountsChanged);
                window.ethereum.on('chainChanged', handleChainChanged);
            } else {
                console.log('Please install MetaMask!');
            }
        }

        connectWallet();

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        }
    }, [account, setAccount]);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(search);
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

    const findActiveLink = (path) => {
        const currentPath = location.pathname.toString();
        if (path === currentPath) {
            return 'activeLink';
        } else {
            return '';
        }
    }

    return (
        <header className='NavbarUser'>
            <nav>
                <div className="logo">
                    <img src="./healthLogo.png" alt="Logo" />
                </div>
                <ul>
                    <li><Link to="/" className={findActiveLink('/')}>Home</Link></li>
                    <li><Link to="/trade" className={findActiveLink('/trade')}>Trade</Link></li>
                    <li><Link to="/cross-chain" className={findActiveLink('/cross-chain')}>Change Chain</Link></li>
                    <li><Link to='/company' className={findActiveLink('/company')}>Deploy NFTs</Link></li>
                </ul>
            </nav>
            <div className='right-on-nav'>
                <form className="search-bar" onClick={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button><IoIosSearch /></button>
                </form>
                {account === '0x0' ? (
                    <button onClick={handleWalletConnection}>Connet to Metamask</button>
                ) : (
                    <button className='account'>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</button>
                )}
            </div>
        </header>
    )
}

export default NavbarUser;