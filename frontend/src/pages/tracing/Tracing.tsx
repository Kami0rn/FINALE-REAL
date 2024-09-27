import React, { useState } from 'react';
import axios from 'axios';
import Nav from '../nav/Nav'; 
import backgroundImage from '../../assets/spectral-light-illuminates-transparent-red-colored-red-roses-abstract-flower-art-generative-ai.jpg';

function Tracing() {
    const [image, setImage] = useState<File | null>(null);
    const [imageHash, setImageHash] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageHash(e.target.value);
    };

    const handleImageUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://127.0.0.1:8080/trace_image_by_upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
            setError(null);
        } catch (err) {
            setError('Error tracing image by upload.');
            setResult(null);
        }
    };

    const handleHashSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageHash) {
            setError('Please enter an image hash.');
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:8080/trace_image', {
                params: { image_hash: imageHash },
            });
            setResult(response.data);
            setError(null);
        } catch (err) {
            setError('Error tracing image by hash.');
            setResult(null);
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <Nav />
                <main className="flex flex-col items-center justify-center flex-1 px-4 fade-in">
                    <form onSubmit={handleImageUpload} className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm mb-8">
                        <h2 className="text-3xl font-semibold mb-4" style={{ 
                            background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent', 
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                        }}>
                            Trace by Image Upload
                        </h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4" />
                        <button type="submit" className="w-full px-6 py-2 mt-4 rounded-full text-black transition" style={{ 
                            background: 'linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))', 
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                        }}>
                            Upload and Trace
                        </button>
                    </form>
                    <form onSubmit={handleHashSubmit} className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
                        <h2 className="text-3xl font-semibold mb-4" style={{ 
                            background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent', 
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                        }}>
                            Trace by Image Hash
                        </h2>
                        <input type="text" value={imageHash} onChange={handleHashChange} placeholder="Enter image hash" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4" />
                        <button type="submit" className="w-full px-6 py-2 mt-4 rounded-full text-black transition" style={{ 
                            background: 'linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))', 
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                        }}>
                            Trace by Hash
                        </button>
                    </form>
                    {error && <p className="mt-4 text-center text-xl" style={{ 
                        background: 'linear-gradient(90deg, rgba(200, 150, 255, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)' 
                    }}>{error}</p>}
                    {result && (
                        <div className="mt-8 w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
                            {result.message ? (
                                <p className="text-xl text-red-600">{result.message}</p>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-semibold mb-4" style={{ 
                                        background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                                        WebkitBackgroundClip: 'text', 
                                        WebkitTextFillColor: 'transparent', 
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                                    }}>
                                        Trace Result
                                    </h2>
                                    <pre className="text-left text-black">{JSON.stringify(result.block, null, 2)}</pre>
                                </>
                            )}
                        </div>
                    )}
                </main>
                <footer className="w-full py-4 text-center text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
                    <p>&copy; 2023 XenoAI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default Tracing;
