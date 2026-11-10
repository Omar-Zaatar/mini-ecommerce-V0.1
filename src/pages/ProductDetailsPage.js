import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import Navbar from '../components/Navbar';
import { getProductById } from '../data/api';

function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToBasket } = useBasket();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProductById(id)
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleAddToBasket = () => {
        for (let i = 0; i < quantity; i++) {
            addToBasket({
                id: product.productID,
                name: product.productName,
                price: product.price,
                image: product.imageUrl
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3>Loading...</h3>
            </div>
        </div>
    );

    if (error || !product) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Product not found!</h2>
                <button onClick={() => navigate('/products')}>Back to Products</button>
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <button style={styles.backButton} onClick={() => navigate('/products')}>
                    ← Back to Products
                </button>

                <div style={styles.card}>
                    <img
                        src={product.imageUrl || 'https:                        alt={product.productName}
                        style={styles.image}
                    />

                    <div style={styles.details}>
                        <h2>{product.productName}</h2>
                        <span style={styles.category}>{product.categoryName}</span>
                        <p style={styles.description}>{product.description || 'No description available.'}</p>
                        <h3 style={styles.price}>${product.price}</h3>

                        <div style={styles.quantityContainer}>
                            <label>Quantity:</label>
                            <div style={styles.quantityControls}>
                                <button
                                    style={styles.qtyButton}
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                >-</button>
                                <span style={styles.qtyNumber}>{quantity}</span>
                                <button
                                    style={styles.qtyButton}
                                    onClick={() => setQuantity(q => q + 1)}
                                >+</button>
                            </div>
                        </div>

                        <button
                            style={{
                                ...styles.addButton,
                                backgroundColor: added ? '#28a745' : '#007bff'
                            }}
                            onClick={handleAddToBasket}
                        >
                            {added ? ' Added to Basket!' : 'Add to Basket'}
                        </button>

                        <button
                            style={styles.basketButton}
                            onClick={() => navigate('/basket')}
                        >
                             View Basket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px 30px' },
    backButton: { padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
    card: { display: 'flex', gap: '40px', backgroundColor: 'white', borderRadius: '10px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    image: { width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px' },
    details: { flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' },
    category: { backgroundColor: '#e8f4fd', color: '#007bff', padding: '4px 12px', borderRadius: '10px', fontSize: '14px', width: 'fit-content' },
    description: { color: '#666', lineHeight: '1.6', fontSize: '15px' },
    price: { color: '#28a745', fontSize: '28px', margin: 0 },
    quantityContainer: { display: 'flex', alignItems: 'center', gap: '15px' },
    quantityControls: { display: 'flex', alignItems: 'center', gap: '10px' },
    qtyButton: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer', fontSize: '18px', backgroundColor: 'white' },
    qtyNumber: { fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' },
    addButton: { padding: '12px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
    basketButton: { padding: '12px', backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }
};

export default ProductDetailsPage;