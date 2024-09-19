import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from '../../assets/3d-colorful-abstract-background-generative-ai.jpg';
import '../login/Login.css'; // Use the same CSS file as the Login page

const Index: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-cover bg-center floating" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <header className="w-full py-4 gradient-animation">
                    <h1 className="text-4xl font-bold text-center text-white" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                        <Link to="/" className="hover:underline">XenoAI</Link>
                    </h1>
                </header>
                
                {/* Main Section */}
                <main className="flex flex-col items-center justify-center flex-1 px-4 fade-in">
                    <h2 className="text-3xl font-semibold mb-4" style={{ 
                        background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Create Stunning Art with AI
                    </h2>
                    <p className="text-center text-xl mb-8" style={{ 
                        background: 'linear-gradient(90deg, rgba(200, 150, 255, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Discover the beauty of AI-generated artwork that mimics the fluidity and magic of watercolor.
                    </p>
                    <button 
                        className="w-2/5 px-6 py-2 mt-4 rounded-full text-black transition" 
                        style={{ 
                            background: 'linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))', 
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                        }}
                        onClick={() => window.location.href = '/register'}
                    >
                        Get Started
                    </button>
                </main>

                {/* Footer */}
                <footer className="w-full py-4 text-center text-white gradient-animation">
                    <p>&copy; 2023 XenoAI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Index;
