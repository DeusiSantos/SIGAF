import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

// Create Authentication Context
const AuthContext = createContext(null);

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userDetails = localStorage.getItem('userDetails');

        if (token && userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password, role) => {
        try {
            const loginResponse = await axios.post('http://82.25.74.219:3000/api/auth/login', {
                email,
                senha: password,
                role
            });

            const userDetailsResponse = await axios.get(`http://82.25.74.219:3000/api/gestores/${loginResponse.data.user.id}`, {
                headers: { 
                    'Authorization': `Bearer ${loginResponse.data.token}` 
                }
            });

            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('userDetails', JSON.stringify(userDetailsResponse.data));

            setUser(userDetailsResponse.data);
            setIsAuthenticated(true);

            return userDetailsResponse.data;
        } catch (error) {
            logout();
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            isLoading, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Private Route Component
export const PrivateRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Carregando...</div>; // Optional loading indicator
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

// Custom hook for using auth context
export const useAuth = () => {
    return useContext(AuthContext);
};