import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full py-4 text-center text-white shadow-lg animate-gradient-x" style={{ background: 'linear-gradient(to right, #f59e0b, #ef4444, #ec4899)', textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
            <p>&copy; 2023 XenoAI. All rights reserved.</p>
        </footer>
    );
};

export default Footer;