import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { customer } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    
    const key = customer ? `wishlist_${customer.customerID}` : null;

        useEffect(() => {
        if (!key) {
            setWishlist([]);
            return;
        }
        setWishlist(JSON.parse(localStorage.getItem(key) || '[]'));
    }, [key]);

        const saveWishlist = (newList) => {
        setWishlist(newList);
        if (key) localStorage.setItem(key, JSON.stringify(newList));
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.id === id);
    };

    const addToWishlist = (product) => {
        if (isInWishlist(product.id)) return;           saveWishlist([...wishlist, product]);
    };

    const removeFromWishlist = (id) => {
        saveWishlist(wishlist.filter(item => item.id !== id));
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const getWishlistCount = () => wishlist.length;

    return (
        <WishlistContext.Provider value={{
            wishlist,
            isInWishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            getWishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}