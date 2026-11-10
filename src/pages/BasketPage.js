import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import Navbar from '../components/Navbar';

function BasketPage() {
    const navigate = useNavigate();
    const {
        basket,
        increaseQuantity,
        decreaseQuantity,
        removeFromBasket,
        getTotal
    } = useBasket();

    if (basket.length === 0) {
        return (
            <div>
                <Navbar />
                <div style={styles.container}>
                    <div style={styles.emptyBasket}>
                        <h2> Your basket is empty!</h2>
                        <button
                            style={styles.continueButton}
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2> Your Basket</h2>

                <div style={styles.layout}>
                    <div style={styles.itemsContainer}>
                        {basket.map(item => (
                            <div key={item.id} style={styles.item}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={styles.image}
                                />
                                <div style={styles.itemDetails}>
                                    <h4 style={styles.itemName}>{item.name}</h4>
                                    <span style={styles.category}>{item.category}</span>
                                    <p style={styles.itemPrice}>${item.price}</p>
                                </div>
                                <div style={styles.quantityControls}>
                                    <button
                                        style={styles.qtyButton}
                                        onClick={() => decreaseQuantity(item.id)}
                                    >
                                        -
                                    </button>
                                    <span style={styles.qty}>{item.quantity}</span>
                                    <button
                                        style={styles.qtyButton}
                                        onClick={() => increaseQuantity(item.id)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div style={styles.itemTotal}>
                                    <p style={styles.totalPrice}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        style={styles.removeButton}
                                        onClick={() => removeFromBasket(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.summary}>
                        <h3>Order Summary</h3>
                        <div style={styles.summaryRow}>
                            <span>Items ({basket.length})</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Shipping</span>
                            <span style={{ color: '#28a745' }}>Free</span>
                        </div>
                        <hr />
                        <div style={styles.summaryTotal}>
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>

                        <button
                            style={styles.checkoutButton}
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            style={styles.continueButton}
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px 30px'
    },
    emptyBasket: {
        textAlign: 'center',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    layout: {
        display: 'flex',
        gap: '30px',
        alignItems: 'flex-start'
    },
    itemsContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    image: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '8px'
    },
    itemDetails: {
        flex: 1
    },
    itemName: {
        margin: '0 0 5px 0'
    },
    category: {
        backgroundColor: '#e8f4fd',
        color: '#007bff',
        padding: '2px 8px',
        borderRadius: '10px',
        fontSize: '12px'
    },
    itemPrice: {
        color: '#666',
        margin: '5px 0 0 0'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    qtyButton: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1px solid #ddd',
        cursor: 'pointer',
        fontSize: '18px',
        backgroundColor: 'white'
    },
    qty: {
        fontSize: '18px',
        fontWeight: 'bold',
        minWidth: '25px',
        textAlign: 'center'
    },
    itemTotal: {
        textAlign: 'right'
    },
    totalPrice: {
        fontWeight: 'bold',
        fontSize: '18px',
        margin: '0 0 10px 0'
    },
    removeButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    summary: {
        width: '280px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    summaryTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '18px'
    },
    checkoutButton: {
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    continueButton: {
        padding: '12px',
        backgroundColor: 'transparent',
        border: '1px solid #007bff',
        color: '#007bff',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default BasketPage;