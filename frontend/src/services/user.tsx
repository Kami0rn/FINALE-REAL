// services/user.ts
export const fetchUserProfile = async (userId: string) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user profile');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};