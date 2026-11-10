import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getProducts } from '../data/api';

const categoryMap = {
    1: 'Candy',
    2: 'Gummies',
    3: 'Sour',
    4: 'Lollipops',
    5: 'Chocolate',
    6: 'Marshmallow',
    7: 'Chewy',
    8: 'Gum',
    9: 'Baking'
};
const categories = ['All', ...Object.values(categoryMap).sort()];

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

        const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); 
        const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const { addToBasket } = useBasket();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();

    const handleWishlist = (product) => {
                if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        toggleWishlist({
            id: product.productID,
            name: product.productName,
            price: product.price,
           
        });
    };

    useEffect(() => {
        getProducts()
            .then(data => {
                const transformedData = data.map(product => ({
                    ...product,
                    category: categoryMap[product.categoryID] || 'Unknown'
                }));
                setProducts(transformedData);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

        useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory, minPrice, maxPrice, sortOrder, pageSize]);

    const handleReset = () => {
        setSearch('');
        setSelectedCategory('All');
        setMinPrice('');
        setMaxPrice('');
        setSortOrder('none');
            };

        const filteredProducts = products
        .filter(p => p.productName.toLowerCase().includes(search.toLowerCase()))
        .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
        .filter(p => minPrice === '' || p.price >= Number(minPrice))
        .filter(p => maxPrice === '' || p.price <= Number(maxPrice));

        if (sortOrder === 'low') filteredProducts.sort((a, b) => a.price - b.price);
    if (sortOrder === 'high') filteredProducts.sort((a, b) => b.price - a.price);

        const totalRecords = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pageProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

    if (loading) return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3>Loading products...</h3>
            </div>
        </div>
    );

    if (error) return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <h3>Error: {error}</h3>
                <p>Make sure your API is running on http:            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h3>Products</h3>
                <div style={styles.filterBar}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        style={{ ...styles.input, width: '90px' }}
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                        style={{ ...styles.input, width: '90px' }}
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <select
                        style={styles.input}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="none">Sort by price</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                    <button style={styles.resetButton} onClick={handleReset}>
                        Reset Filters
                    </button>
                </div>
                <div style={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            style={{
                                ...styles.catButton,
                                backgroundColor: selectedCategory === cat ? '#007bff' : '#e0e0e0',
                                color: selectedCategory === cat ? 'white' : 'black'
                            }}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div style={styles.grid}>
                    {pageProducts.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        pageProducts.map(product => (
                            <div key={product.productID} style={styles.card}>
                                <img
                                    src={product.imageUrl || 'https:  alt={product.productName}
                                    style={styles.image}
                                    onClick={() => navigate(`/products/${product.productID}`)}
                                />
                                <div style={styles.cardBody}>
                                    <h4
                                        style={styles.productName}
                                        onClick={() => navigate(`/products/${product.productID}`)}
                                    >
                                        {product.productName}
                                    </h4>
                                    <p style={styles.price}>${product.price}</p>
                                    <button
                                        className="add-to-basket-btn"
                                        onClick={() => addToBasket({
                                            id: product.productID,
                                            name: product.productName,
                                            price: product.price,
                                            image: product.imageUrl
                                        })}
                                    >
                                        Add to Basket
                                    </button>
                                    <button
                                        className="add-to-wishlist-btn"
                                        onClick={() => handleWishlist(product)}
                                    >
                                        {isInWishlist(product.productID) ? ' In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div style={styles.pagination}>
                    <span>
                        Showing {totalRecords === 0 ? 0 : startIndex + 1}
                        -{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords} products
                    </span>

                    <div style={styles.pageControls}>
                        <label>Page size: </label>
                        <select
                            style={styles.input}
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>

                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px 30px' },
    filterBar: { display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' },
    input: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
    resetButton: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    categories: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
    catButton: { padding: '8px 16px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
    image: { width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' },
    cardBody: { padding: '15px' },
    productName: { margin: '0 0 5px 0', cursor: 'pointer', fontSize: '16px' },
    price: { fontWeight: 'bold', fontSize: '18px', margin: '10px 0' },
    wishlistButton: { width: '100%', padding: '8px', marginTop: '8px', backgroundColor: 'red', border: '1px solid #dc3545', color: 'black', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' },
    pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '10px' },
    pageControls: { display: 'flex', alignItems: 'center', gap: '10px' },
    pageButton: { padding: '8px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default ProductsPage;