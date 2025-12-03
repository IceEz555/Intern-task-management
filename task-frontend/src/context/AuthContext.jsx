import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Lazy initialization to check localStorage on mount (Fixes useEffect warning)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading] = useState(false); // No need to load if we read sync from localStorage

    const login = async (email, password) => {
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Logic
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        let role = 'Member';
        let name = 'Member User';

        if (email.includes('admin') || email === 'admin@example.com') {
            role = 'Admin';
            name = 'Admin User';
        } else if (email.includes('pm') || email === 'pm@example.com') {
            role = 'PM';
            name = 'Project Manager';
        }

        const userData = { email, name, role };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
