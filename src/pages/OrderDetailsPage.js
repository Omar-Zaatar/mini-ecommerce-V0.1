import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { getOrderById, cancelOrder } from '../data/api';

function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrder = () => {
        getOrderById(id, token)
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

        useEffect(() => { loadOrder(); }, [id]);

    const handleCancel = async () => {
        const sure = window.confirm(`Cancel order #${order.orderID}? This cannot be undone.`);
        if (!sure) return;

        try {
            await cancelOrder(order.orderID, token);
            loadOrder();           } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}><h3>Loading...</h3></div>
        </div>
    );

    if (error || !order) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Order not found!</h2>
                <button style={styles.primaryButton} onClick={() => navigate('/orders')}>
                    Back to Orders
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <button style={styles.backButton} onClick={() => navigate('/orders')}>
                    ← Back to Orders
                </button>

                <div style={styles.card}>
                    <div style={styles.header}>
                        <h2 style={{ margin: 0 }}>Order #{order.orderID}</h2>
                        <StatusBadge status={order.status} />
                    </div>
                    <p style={styles.date}>
                        Placed on {new Date(order.orderDate).toLocaleString()}
                    </p>

                    <h4>Products</h4>
                    {order.items.length === 0 ? (
                        <p style={{ color: '#666' }}>
                            No product details were saved for this order.
                        </p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Product</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Quantity</th>
                                    <th style={styles.th}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.orderDetailID}>
                                            <td style={styles.td}>{item.productName}</td>
                                            <td style={styles.td}>${item.price.toFixed(2)}</td>
                                            <td style={styles.td}>{item.quantity}</td>
                                            <td style={styles.td}>${item.totalAmount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}

                    <div style={styles.total}>
                        <strong>Total</strong>
                        <strong>${order.totalAmount.toFixed(2)}</strong>
                    </div>

                    {order.status === 'Pending' && (
                        <button style={styles.cancelButton} onClick={handleCancel}>
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px 30px' },
    backButton: { padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    header: { display: 'flex', alignItems: 'center', gap: '15px' },
    date: { color: '#666' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' },
    td: { padding: '10px', borderBottom: '1px solid #eee' },
    total: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', padding: '15px 10px' },
    primaryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    cancelButton: { padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }
};

export default OrderDetailsPage;