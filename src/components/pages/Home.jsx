import React, { useState, useRef } from 'react';

// Importing styles
import '../styles/Home.css';

function Home() {
    const [imageToJudge, setImageToJudge] = useState(null);
    const [docToJudge, setDocToJudge] = useState(null);
    const imageRef = useRef(null);
    const docRef = useRef(null);

    const handleImgClick = () => {
        imageRef.current.click();
    }

    const handleDocClick = () => {
        docRef.current.click();
    }

    const handleImageChange = (e) => {
        setImageToJudge(e.target.files[0]);
    }

    const handleDocChange = (e) => {
        setDocToJudge(e.target.files[0]);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imageToJudge);
        formData.append('doc', docToJudge);
    }

    return (
        <section className='Home'>
            <form onSubmit={handleFormSubmit}>
                <input
                    ref={imageRef}
                    type="file"
                    onChange={handleImageChange}
                    allowed="image/*"
                />
                <button onClick={handleImgClick}>Upload your Image</button>
                <input
                    ref={docRef}
                    type="file"
                    onChange={handleDocChange}
                    allowed='application/pdf'
                />
                <button onClick={handleDocClick}>Upload you BMI</button>
            </form>
        </section>
    )
}

export default Home;