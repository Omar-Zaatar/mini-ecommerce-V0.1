import React, { createContext, useContext, useState } from 'react';

const BasketContext = createContext();

export function BasketProvider({ children }) {
    const [basket, setBasket] = useState([]);

        const addToBasket = (product) => {
        setBasket(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
                    return [...prev, { ...product, quantity: 1 }];
        });
    };

        const increaseQuantity = (id) => {
        setBasket(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

        const decreaseQuantity = (id) => {
        setBasket(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

        const removeFromBasket = (id) => {
        setBasket(prev => prev.filter(item => item.id !== id));
    };

    const clearBasket = () => {
        setBasket([]);
    };

        const getTotal = () => {
        let total = 0;

        basket.forEach((item) => {
           
            total += item.price * item.quantity;
        });

        return total;
   
    };

        const getItemCount = () => {
        return basket.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <BasketContext.Provider value={{
            basket,
            addToBasket,
            increaseQuantity,
            decreaseQuantity,
            removeFromBasket,
            getTotal,
            clearBasket,
            getItemCount

        }}>
            {children}
        </BasketContext.Provider>
    );
}

export function useBasket() {
    return useContext(BasketContext);
}