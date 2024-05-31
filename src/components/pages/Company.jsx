import React, { useState } from 'react';

// Importing styles
import '../styles/Company.css';

function Company() {
    const [selfNft, setSelfNft] = useState([]);

    return (
        <section>
            <button onClick={hnadleDeployNft}>Deploy</button>
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