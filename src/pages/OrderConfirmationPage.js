import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';

function OrderConfirmationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { basket, getTotal } = useBasket();

    const { orderNumber, total, address, paymentMethod } = location.state || {};

    const { removeFromBasket } = useBasket();
    useEffect(() => {
        
        basket.forEach(item => removeFromBasket(item.id));
    }, []);

    if (!orderNumber) {
        return (
            <div style={styles.container}>
                <h2>No order found!</h2>
                <button onClick={() => navigate('/products')}>Go to Products</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
               
                <div style={styles.successIcon}>✅</div>

                <h2 style={styles.title}>Order Confirmed!</h2>
                <p style={styles.subtitle}>
                    Thank you for your order. Your order has been placed successfully!
                </p>
                <div style={styles.detailsBox}>
                    <div style={styles.detailRow}>
                        <span style={styles.label}>Order Number:</span>
                        <span style={styles.value}>#{orderNumber}</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.label}>Total Amount:</span>
                        <span style={styles.value}>${total.toFixed(2)}</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.label}>Shipping Address:</span>
                        <span style={styles.value}>{address}</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.label}>Payment Method:</span>
                        <span style={styles.value}>{paymentMethod}</span>
                    </div>
                </div>

                <p style={styles.message}>
                     A confirmation email will be sent to you shortly.
                </p>

                <button
                    style={styles.button}
                    onClick={() => navigate('/products')}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    successIcon: {
        fontSize: '60px'
    },
    title: {
        color: '#28a745',
        margin: 0
    },
    subtitle: {
        color: '#666',
        margin: 0
    },
    detailsBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        textAlign: 'left'
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        color: '#666',
        fontSize: '14px'
    },
    value: {
        fontWeight: 'bold',
        fontSize: '14px'
    },
    message: {
        color: '#666',
        fontSize: '14px',
        margin: 0
    },
    button: {
        padding: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default OrderConfirmationPage;