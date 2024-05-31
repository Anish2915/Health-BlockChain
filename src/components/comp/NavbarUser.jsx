import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";

// Importing styles
import '../styles/NavbarUser.css';

function NavbarUser() {
    const [search, setSearch] = useState('');
    const [login, setLogin] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(search);
    }

    return (
        <header className='NavbarUser'>
            <nav>
                <div className="logo">
                    <img src="./healthLogo.png" alt="Logo" />
                </div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/trade">Trade</Link></li>
                    <li><Link to="/cross-chain">Change Chain</Link></li>
                    <li><Link to='/company'>Deploy NFTs</Link></li>
                </ul>
            </nav>
            <div>
                <form className="search-bar" onClick={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button><IoIosSearch /></button>
                </form>
                {login ? (
                    <div className="account">
                        <Link to="/profile">Profile</Link>
                        <Link to="/logout">Logout</Link>
                    </div>
                ) : (
                    <div className="account">
                        <Link to="/login">Connect to MetaMask</Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default NavbarUser;