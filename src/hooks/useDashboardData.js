import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCustomers, getAllOrders, getAllOrderItems } from '../data/api';

export function useDashboardData(token) {
    const [data, setData] = useState({ products: [], customers: [], orders: [], items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const load = useCallback((silent = false) => {
        if (!silent) setLoading(true);
        setError(null);

        return Promise.all([
            getProducts(),
            getCustomers(token),
            getAllOrders(token),
            getAllOrderItems(token)
        ])
            .then(([products, customers, orders, items]) => {
                setData({ products, customers, orders, items });
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    useEffect(() => { load(); }, [load]);

    return {
        ...data,
        loading,
        error,
        reload: () => load(),           
        refresh: () => load(true)      
    };
}