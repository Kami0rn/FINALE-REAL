import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Nav from '../nav/Nav'; // Adjust the import path as necessary

Modal.setAppElement('#root'); // Set the root element for accessibility

function Generate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [hoveredImage, setHoveredImage] = useState<number | null>(null);

    const generateImages = async () => {
        const username = localStorage.getItem('username');
        const userCustomName = localStorage.getItem('user_model_name');

        if (!username || !userCustomName) {
            setError('Username or user model name not found in local storage.');
            return;
        }

        setLoading(true);
        setError(null);
        setImages([]);

        try {
            const generatedImages: string[] = [];

            // Making 10 separate calls
            for (let i = 0; i < 20; i++) {
                const response = await axios.get(
                    `http://127.0.0.1:5000/generate_image/${username}/${userCustomName}?timestamp=${new Date().getTime()}`,
                    {
                        responseType: 'blob',
                    }
                );
                const imageUrl = URL.createObjectURL(response.data);
                generatedImages.push(imageUrl);
            }

            setImages(generatedImages);
        } catch (err) {
            setError('Error generating images.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/path/to/your/background.jpg')` }}>
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <Nav />
                <main className="flex flex-col items-center justify-center flex-1 px-4 fade-in">
                    <h1 className="text-3xl font-semibold mb-4" style={{ 
                        background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Generate Images
                    </h1>
                    <button onClick={generateImages} disabled={loading} className="w-full max-w-md px-3 py-2 mb-4 text-white bg-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                        {loading ? 'Generating...' : 'Generate Images'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="grid grid-cols-5 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative"
                                onMouseEnter={() => setHoveredImage(index)}
                                onMouseLeave={() => setHoveredImage(null)}
                            >
                                <img src={image} alt={`Generated ${index}`} className="w-full h-auto rounded-lg shadow-lg" />
                                {hoveredImage === index && (
                                    <a
                                        href={image}
                                        download={`generated_image_${index}.png`}
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg"
                                    >
                                        Download
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
                <footer className="w-full py-4 text-center text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
                    <p>&copy; 2023 XenoAI. All rights reserved.</p>
                </footer>
            </div>
            <Modal
                isOpen={loading}
                contentLabel="Loading"
                className="flex items-center justify-center min-h-screen"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            >
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Generating Images...</h2>
                    <p>Please wait while we generate your images.</p>
                </div>
            </Modal>
        </div>
    );
}

export default Generate;
