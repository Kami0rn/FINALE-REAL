import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import login from '../../services/login'; // Adjust the import path as necessary
import backgroundImage from '../../assets/spectral-light-illuminates-transparent-red-colored-red-roses-abstract-flower-art-generative-ai.jpg';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await login(username, password);
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id);  // Save token to local storage
            navigate('/profile'); // Redirect to /profile
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <header className="w-full py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
                    <h1 className="text-4xl font-bold text-center text-white" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                        <Link to="/" className="hover:underline">XenoAI</Link>
                    </h1>
                </header>
                <main className="flex flex-col items-center justify-center flex-1 px-4 fade-in">
                    <h2 className="text-3xl font-semibold mb-4" style={{ 
                        background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Login
                    </h2>
                    {error && <p className="mb-4 text-center text-xl" style={{ 
                        background: 'linear-gradient(90deg, rgba(200, 150, 255, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)' 
                    }}>{error}</p>}
                    <form onSubmit={handleLogin} className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <button type="submit" className="w-full px-6 py-2 mt-4 rounded-full text-black transition" style={{ 
                            background: 'linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))', 
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                        }}>
                            Login
                        </button>
                    </form>
                    <p className="mt-4 text-white">
                        Don't have an account? <Link to="/register" className="text-pink-500 underline">Register here</Link>
                    </p>
                </main>
                <footer className="w-full py-4 text-center text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
                    <p>&copy; 2023 XenoAI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Login;
