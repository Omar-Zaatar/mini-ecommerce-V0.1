import { useState, useEffect, useCallback } from 'react';
import { getAdminOrder } from '../data/api';

export function useAdminOrder(orderId, token) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

        const load = useCallback((silent = false) => {
        if (!silent) setLoading(true);
        setError(null);

        return getAdminOrder(orderId, token)
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [orderId, token]);

    useEffect(() => { load(); }, [load]);

    return {
        order,
        loading,
        error,
        reload: () => load(),
        refresh: () => load(true)
    };
}