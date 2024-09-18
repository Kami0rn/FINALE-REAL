// services/auth.tsx
import { jwtDecode } from 'jwt-decode'; // Correct import statement

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUserFromToken = () => {
    const token = getToken();
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    return null;
};