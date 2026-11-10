const API_BASE_URL = "http:

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error("Invalid email or password");
    return await response.json();
};

export const verifyOtp = async (email, otp, preAuthToken) => {
    const response = await fetch(`${API_BASE_URL}/customers/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, preAuthToken })
    });
    if (!response.ok) throw new Error("Invalid OTP");
    return await response.json();
};

export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
};

export const getProductById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
};

export const placeOrder = async (orderData, token) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error("Failed to place order");
    return await response.json();
};
export const getOrders = async (token) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to load orders");
    return await response.json();
};

export const getOrderById = async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Order not found");
    return await response.json();
};

export const cancelOrder = async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(await response.text() || "Failed to cancel order");
    return await response.json();
};

export const getProfile = async (token) => {
    const response = await fetch(`${API_BASE_URL}/customers/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (!response.ok) throw new Error("Failed to load profile");
    return await response.json();
};

export const updateProfile = async (profileData, token) => {
    const response = await fetch(`${API_BASE_URL}/customers/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (!response.ok) throw new Error(await response.text() || "Failed to update profile");
    return await response.json();
};

export const changePassword = async (passwordData, token) => {
    const response = await fetch(`${API_BASE_URL}/customers/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (!response.ok) throw new Error(await response.text() || "Failed to change password");
    return await response.json();
};

export const getCustomers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to load customers");
    return await response.json();
};

export const getAllOrders = async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (response.status === 403) throw new Error("You do not have access to the dashboard.");
    if (!response.ok) throw new Error("Failed to load orders");
    return await response.json();
};

export const getAllOrderItems = async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/order-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (response.status === 403) throw new Error("You do not have access to the dashboard.");
    if (!response.ok) throw new Error("Failed to load order items");
    return await response.json();
};
export const updateOrderStatus = async (orderId, status, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (response.status === 403) throw new Error("You do not have access to this action.");
    if (!response.ok) throw new Error(await response.text() || "Failed to update the order");
    return await response.json();
};
export const getAdminOrder = async (orderId, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error("Session expired. Please log in again.");
    if (response.status === 403) throw new Error("You do not have access to this page.");
    if (response.status === 404) throw new Error("Order not found");
    if (!response.ok) throw new Error("Failed to load the order");
    return await response.json();
};