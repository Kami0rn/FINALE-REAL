// services/registerService.ts
export const registerUser = async (userData: any) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register user');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};