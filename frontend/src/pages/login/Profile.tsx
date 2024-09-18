// Profile.tsx
import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../services/user';

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
        <div>
            <h2>User Profile</h2>
            {user ? (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>First Name: {user.firstname}</p>
                    <p>Last Name: {user.lastname}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default UserProfile;