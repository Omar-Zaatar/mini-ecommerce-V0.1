import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { getItemCount, clearBasket } = useBasket();
    const { getWishlistCount } = useWishlist();
        const { logout, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
        clearBasket();
        navigate('/login');
    };

    return (
        <div style={styles.navbar}>
            <h2 style={styles.logo} className="nav-link" onClick={() => navigate('/products')}>
                Mini E-Commerce
            </h2>
            <div style={styles.navLinks}>
                <span className="nav-link" onClick={() => navigate('/products')}>
                    Products
                </span>
                <span className="nav-link" onClick={() => navigate('/wishlist')}>
                    Wishlist ({getWishlistCount()})
                </span>
                <span className="nav-link" onClick={() => navigate('/orders')}>
                    Orders
                </span>
                <span className="nav-link" onClick={() => navigate('/basket')}>
                    Basket ({getItemCount()})
                </span>
                <span className="nav-link" onClick={() => navigate('/profile')}>
                    Profile
                </span>
                {isAdmin && (
                    <span className="nav-link" onClick={() => navigate('/admin')}>
                        Dashboard
                    </span>
                )}
                <span className="nav-link" onClick={handleLogout}>
                    Logout
                </span>
            </div>
        </div>
    );
}

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#007bff',
        color: 'white'
    },
    logo: {
        margin: 0,
        cursor: 'pointer',
        color: 'white'
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    }
};

export default Navbar;