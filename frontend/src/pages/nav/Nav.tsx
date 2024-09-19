import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-pink-200 via-green-200 to-purple-200 p-4 fixed top-0 w-full z-50 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>AI Artist</div>
                {/* MENU Button */}
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="text-black focus:outline-none p-2 rounded-md hover:bg-gray-300"
                    >
                        MENU
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/generate"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Generate
                            </Link>
                            <Link
                                to="/tracing"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Tracing
                            </Link>
                            <Link
                                to="/blockchain"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Blockchain
                            </Link>
                            <Link
                                to="/"
                                className="block px-4 py-2 text-red-500 hover:bg-red-700"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user_id');
                                    setIsOpen(false);
                                }}
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
