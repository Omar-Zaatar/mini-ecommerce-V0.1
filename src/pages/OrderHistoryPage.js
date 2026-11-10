import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { getOrders, cancelOrder } from '../data/api';

function OrderHistoryPage() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrders = () => {
        getOrders(token)
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

        useEffect(() => { loadOrders(); }, []);

    const handleCancel = async (orderId) => {
                const sure = window.confirm(`Cancel order #${orderId}? This cannot be undone.`);
        if (!sure) return;

        try {
            await cancelOrder(orderId, token);
            loadOrders();           } catch (err) {
            alert(err.message);
        }
    };

        const statuses = ['All', ...new Set(orders.map(o => o.status))];

    const filteredOrders = statusFilter === 'All'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    if (loading) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}><h3>Loading orders...</h3></div>
        </div>
    );

    if (error) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}><h3>Error: {error}</h3></div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2> My Orders ({filteredOrders.length})</h2>
                    <div>
                        <label>Status: </label>
                        <select
                            style={styles.select}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div style={styles.empty}>
                        <p>No orders found.</p>
                        <button style={styles.primaryButton} onClick={() => navigate('/products')}>
                            Go to Products
                        </button>
                    </div>
                ) : (
                    <div style={styles.list}>
                        {filteredOrders.map(order => (
                            <div key={order.orderID} style={styles.card}>
                                <div style={styles.cardInfo}>
                                    <strong>Order #{order.orderID}</strong>
                                    <span style={styles.date}>
                                        {new Date(order.orderDate).toLocaleString()}
                                    </span>
                                </div>
                                <StatusBadge status={order.status} />
                                <strong>${order.totalAmount.toFixed(2)}</strong>

                                <div style={styles.actions}>
                                    <button
                                        style={styles.primaryButton}
                                        onClick={() => navigate(`/orders/${order.orderID}`)}
                                    >
                                        View Details
                                    </button>
                                    {order.status === 'Pending' && (
                                        <button
                                            style={styles.cancelButton}
                                            onClick={() => handleCancel(order.orderID)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px 30px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
    select: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    card: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', backgroundColor: 'white', borderRadius: '10px', padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexWrap: 'wrap' },
    cardInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    date: { color: '#666', fontSize: '13px' },
    actions: { display: 'flex', gap: '10px' },
    empty: { textAlign: 'center', padding: '40px' },
    primaryButton: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    cancelButton: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default OrderHistoryPage;