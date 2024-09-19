import React from 'react';
import backgroundImage from '../../assets/3d-colorful-abstract-background-generative-ai.jpg';

const Index: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <header className="w-full py-4" style={{ background: 'linear-gradient(90deg, rgba(255,153,255,0.7), rgba(204,255,255,0.7), rgba(255,204,153,0.7))' }}>
                    <h1 className="text-4xl font-bold text-center text-white" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                        AI Artist
                    </h1>
                </header>
                
                {/* Main Section */}
                <main className="flex flex-col items-center justify-center flex-1 px-4">
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
                        className="px-6 py-2 rounded-full text-white transition" 
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
                <footer className="w-full py-4 text-center text-white" style={{ background: 'linear-gradient(90deg, rgba(255,204,204,0.8), rgba(204,255,204,0.8), rgba(255,204,255,0.8))' }}>
                    <p>&copy; 2023 AI Artist. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Index;
