import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const readPayload = (token) => {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return null;
    }
};

const isTokenValid = (token) => {
    const payload = readPayload(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
};

export const isAdminToken = (token) => {
    const payload = readPayload(token);
    if (!payload) return false;
    const role = payload[ROLE_CLAIM] || payload.role;
    return Array.isArray(role) ? role.includes('Admin') : role === 'Admin';
};

const getSavedToken = () => {
    const saved = localStorage.getItem('token');
    if (isTokenValid(saved)) return saved;

    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    return null;
};

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getSavedToken());
    const [customer, setCustomer] = useState(
        getSavedToken() ? JSON.parse(localStorage.getItem('customer') || 'null') : null
    );

        const saveLogin = (newToken, newCustomer) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('customer', JSON.stringify(newCustomer));
        setToken(newToken);
        setCustomer(newCustomer);
    };

        const updateCustomer = (updated) => {
        const newCustomer = { ...customer, ...updated };
        localStorage.setItem('customer', JSON.stringify(newCustomer));
        setCustomer(newCustomer);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customer');
        setToken(null);
        setCustomer(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            customer,
            isAuthenticated: !!token,
            isAdmin: isAdminToken(token),
            saveLogin,
            updateCustomer,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}