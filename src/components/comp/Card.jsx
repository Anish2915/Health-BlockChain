import React from 'react';

// Importing styles
import '../styles/Card.css';

function Card({ title, cardImg, cardText }) {
    return (
        <div className="Card">
            <div className="info">
                <span className="title">
                    <img src={cardImg} alt="" />
                    {title}
                </span>
                <span className="description">{cardText}</span>
            </div>
            <div className="dropdown">
                <span className="arrow">▼</span>
            </div>
        </div>
    );
}

export default Card;
