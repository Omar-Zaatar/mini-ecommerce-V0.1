import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import Navbar from '../components/Navbar';
import { placeOrder } from '../data/api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { basket, getTotal } = useBasket();

    const [form, setForm] = useState({
        address: '',
        mobile: '',
        paymentMethod: 'Credit Card'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let newErrors = {};
        if (!form.address.trim()) newErrors.address = 'Address is required';
        if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
        if (!/^\d{10,}$/.test(form.mobile)) newErrors.mobile = 'Enter a valid mobile number';
        return newErrors;
    };

    const handleConfirmOrder = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const orderData = {
                address: form.address,
                mobile: form.mobile,
                paymentMethod: form.paymentMethod,
                totalAmount: getTotal(),
                items: basket.map(item => ({
                    productID: item.id,
                    quantity: item.quantity
                }))
            };

            const token = localStorage.getItem('token');
            const result = await placeOrder(orderData, token);

            navigate('/order-confirmation', {
                state: {
                    orderNumber: result.orderID,
                    total: getTotal(),
                    address: form.address,
                    paymentMethod: form.paymentMethod
                }
            });
        } catch (err) {
            alert("Failed to place order. Please try again.");
        }
    };


    if (basket.length === 0) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '30px', textAlign: 'center' }}>
                    <h2>Your basket is empty!</h2>
                    <button onClick={() => navigate('/products')}>
                        Go to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2>Checkout</h2>

                <div style={styles.layout}>
                    <div style={styles.formCard}>
                        <h4>Shipping Information</h4>

                        <div style={styles.field}>
                            <label>Shipping Address</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="address"
                                placeholder="Enter your address"
                                value={form.address}
                                onChange={handleChange}
                            />
                            {errors.address &&
                                <span style={styles.error}>{errors.address}</span>}
                        </div>

                        <div style={styles.field}>
                            <label>Mobile Number</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="mobile"
                                placeholder="Enter mobile number"
                                value={form.mobile}
                                onChange={handleChange}
                            />
                            {errors.mobile &&
                                <span style={styles.error}>{errors.mobile}</span>}
                        </div>

                        <div style={styles.field}>
                            <label>Payment Method</label>
                            <select
                                style={styles.input}
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                            >
                                <option>Credit Card</option>
                                <option>Debit Card</option>
                                <option>Cash on Delivery</option>
                                <option>PayPal</option>
                            </select>
                        </div>
                    </div>
                    <div style={styles.summary}>
                        <h4>Order Summary</h4>
                        {basket.map(item => (
                            <div key={item.id} style={styles.summaryItem}>
                                <span>{item.name} x{item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <div style={styles.total}>
                            <strong>Total</strong>
                            <strong>${getTotal().toFixed(2)}</strong>
                        </div>

                        <button
                            style={styles.confirmButton}
                            onClick={handleConfirmOrder}
                        >
                            Confirm Order
                        </button>

                        <button
                            style={styles.backButton}
                            onClick={() => navigate('/basket')}
                        >
                            ← Back to Basket
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
    layout: {
        display: 'flex',
        gap: '30px',
        alignItems: 'flex-start'
    },
    formCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    error: {
        color: 'red',
        fontSize: '12px'
    },
    summary: {
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px'
    },
    total: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '18px'
    },
    confirmButton: {
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    backButton: {
        padding: '12px',
        backgroundColor: 'transparent',
        border: '1px solid #007bff',
        color: '#007bff',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default CheckoutPage;