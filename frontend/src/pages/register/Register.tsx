import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/register';
import backgroundImage from '../../assets/colorful-wallpaper-background-multicolored-generative-ai.jpg';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            if (response && response.username) {
                setMessage('Registration successful!');
                console.log('Registered user:', response);
                navigate('/login');
            } else {
                setMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <header className="w-full py-4" style={{ background: 'linear-gradient(90deg, rgba(255,153,255,0.7), rgba(204,255,255,0.7), rgba(255,204,153,0.7))' }}>
                    <h1 className="text-4xl font-bold text-center text-white" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                        AI Artist
                    </h1>
                </header>
                <main className="flex flex-col items-center justify-center flex-1 px-4">
                    <h2 className="text-3xl font-semibold mb-4" style={{ 
                        background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Register
                    </h2>
                    {message && <p className="mb-4 text-center text-xl" style={{ 
                        background: 'linear-gradient(90deg, rgba(200, 150, 255, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)' 
                    }}>{message}</p>}
                    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white bg-opacity-70 p-8 rounded-lg shadow-lg backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <button type="submit" className="w-full px-6 py-2 rounded-full text-white transition" style={{ 
                                background: 'linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))', 
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                            }}>
                                Register
                            </button>
                        </div>
                    </form>
                </main>
                <footer className="w-full py-4 text-center text-white" style={{ background: 'linear-gradient(90deg, rgba(255,204,204,0.8), rgba(204,255,204,0.8), rgba(255,204,255,0.8))' }}>
                    <p>&copy; 2023 AI Artist. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Register;