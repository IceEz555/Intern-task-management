import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Lazy initialization to check localStorage on mount (Fixes useEffect warning)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser || savedUser === 'undefined') return null;
        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            localStorage.removeItem('user');
            return null;
        }
    });
    const [loading] = useState(false); // No need to load if we read sync from localStorage

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/login`, {
                email,
                password
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/logout`);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
