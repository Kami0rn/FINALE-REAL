// Profile.tsx
import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../services/user';
import Navbar from '../nav/Nav'; // Adjust the path as necessary

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUserProfile = async () => {
            const userId = localStorage.getItem('user_id');
            if (userId) {
                console.log('Calling fetchUserProfile with userId:', userId); // Debugging log
                const userData = await fetchUserProfile(userId);
                console.log('Fetched user data:', userData); // Debugging log
                if (userData) {
                    setUser(userData);
                    console.log('User state set:', userData); // Debugging log
                }
            } else {
                console.error('No user ID found. Please log in.');
            }
        };

        getUserProfile();
    }, []);

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: '#e6e6fa' }}>
            <Navbar />
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <header className="w-full py-4" style={{ background: 'linear-gradient(90deg, rgba(255,153,255,0.7), rgba(204,255,255,0.7), rgba(255,204,153,0.7))' }}>
                    <h1 className="text-4xl font-bold text-center text-white" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                        XenoAI
                    </h1>
                </header>
                <main className="flex flex-col items-center justify-center flex-1 px-4">
                    <h2 className="text-3xl font-semibold mb-4" style={{ 
                        background: 'linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        User Profile
                    </h2>
                    <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg backdrop-blur-sm w-full max-w-md" style={{ width: '400px' }}>
                        {user ? (
                            <div>
                                <p className="text-lg"><span className="font-semibold">Username:</span> {user.username}</p>
                                <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
                                <p className="text-lg"><span className="font-semibold">First Name:</span> {user.firstname}</p>
                                <p className="text-lg"><span className="font-semibold">Last Name:</span> {user.lastname}</p>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No user data available.</p>
                        )}
                    </div>
                </main>
                <footer className="w-full py-4 text-center text-white" style={{ background: 'linear-gradient(90deg, rgba(255,204,204,0.8), rgba(204,255,204,0.8), rgba(255,204,255,0.8))' }}>
                    <p>&copy; 2023 XenoAI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default UserProfile;
