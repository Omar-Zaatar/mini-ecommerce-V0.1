import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useBasket } from '../context/BasketContext';
import Navbar from '../components/Navbar';

function WishlistPage() {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToBasket } = useBasket();
    const handleAddToBasket = (item) => {
        addToBasket(item);
        removeFromWishlist(item.id);
    };

    if (wishlist.length === 0) {
        return (
            <div>
                <Navbar />
                <div style={styles.empty}>
                    <h2>Your wishlist is empty!</h2>
                    <button style={styles.primaryButton} onClick={() => navigate('/products')}>
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2> My Wishlist ({wishlist.length})</h2>

                <div style={styles.grid}>
                    {wishlist.map(item => (
                        <div key={item.id} style={styles.card}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={styles.image}
                                onClick={() => navigate(`/products/${item.id}`)}
                            />
                            <div style={styles.cardBody}>
                                <h4
                                    style={styles.name}
                                    onClick={() => navigate(`/products/${item.id}`)}
                                >
                                    {item.name}
                                </h4>
                                <p style={styles.price}>${item.price}</p>
                                <button
                                    className="add-to-basket-btn"
                                    onClick={() => handleAddToBasket(item)}
                                >
                                    Add to Basket
                                </button>
                                <button
                                    style={styles.removeButton}
                                    onClick={() => removeFromWishlist(item.id)}
                                >
                                     Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px 30px' },
    empty: { textAlign: 'center', padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
    image: { width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' },
    cardBody: { padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' },
    name: { margin: 0, cursor: 'pointer', fontSize: '16px' },
    price: { fontWeight: 'bold', fontSize: '18px', margin: '5px 0' },
    primaryButton: { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
    removeButton: { padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }
};

export default WishlistPage;