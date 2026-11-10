import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, isAdminToken } from '../context/AuthContext';
import { login, verifyOtp } from '../data/api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [preAuthToken, setPreAuthToken] = useState('');
    const [customer, setCustomer] = useState(null);
    const [step, setStep] = useState(1);     const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { saveLogin } = useAuth();

    const handleLogin = async () => {
        if (!email.trim()) { setErrors({ email: 'Email is required' }); return; }
        if (!password.trim()) { setErrors({ password: 'Password is required' }); return; }

        setLoading(true);
        try {
                        const result = await login(email, password);
            setPreAuthToken(result.preAuthToken);
            setCustomer(result.customer);
            setErrors({});
            setStep(2);         } catch (err) {
            setErrors({ general: err.message });
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) { setErrors({ otp: 'OTP is required' }); return; }

        setLoading(true);
        try {
            const result = await verifyOtp(email, otp, preAuthToken);
                        saveLogin(result.token, customer);

            if (isAdminToken(result.token)) {
                navigate('/admin', { replace: true });               } else {
                                const goTo = location.state?.from?.pathname || '/products';
                navigate(goTo, { replace: true });
            }
        } catch (err) {
            setErrors({ otp: 'Invalid OTP. Please try again.' });
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}> Mini E-Commerce</h2>

                {step === 1 ? (
                    <>
                        <h4 style={styles.subtitle}>Login</h4>

                        {errors.general &&
                            <p style={styles.error}>{errors.general}</p>}

                        <div style={styles.field}>
                            <label>Email</label>
                            <input
                                style={styles.input}
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email &&
                                <span style={styles.error}>{errors.email}</span>}
                        </div>

                        <div style={styles.field}>
                            <label>Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password &&
                                <span style={styles.error}>{errors.password}</span>}
                        </div>

                        <button
                            style={styles.button}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Login'}
                        </button>
                    </>
                ) : (
                    <>
                        <h4 style={styles.subtitle}>Enter OTP</h4>
                        <p style={{ color: '#666', textAlign: 'center' }}>
                            We sent a verification code to<br />
                            <strong>{email}</strong>
                        </p>

                        <div style={styles.field}>
                            <label>OTP Code</label>
                            <input
                                style={{
                                    ...styles.input, textAlign: 'center',
                                    fontSize: '24px', letterSpacing: '8px'
                                }}
                                type="text"
                                placeholder="_ _ _ _ _"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                            {errors.otp &&
                                <span style={styles.error}>{errors.otp}</span>}
                        </div>

                        <button
                            style={styles.button}
                            onClick={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button
                            style={{
                                ...styles.button,
                                backgroundColor: 'transparent',
                                color: '#007bff',
                                border: '1px solid #007bff',
                                marginTop: '10px'
                            }}
                            onClick={() => { setStep(1); setOtp(''); setErrors({}); setPreAuthToken(''); }}
                        >
                            ← Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#f5f5f5'
    },
    card: {
        backgroundColor: 'white', padding: '40px', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px',
        display: 'flex', flexDirection: 'column', gap: '15px'
    },
    title: { textAlign: 'center', margin: 0 },
    subtitle: { textAlign: 'center', color: '#666', margin: 0 },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    input: {
        padding: '10px', borderRadius: '5px',
        border: '1px solid #ddd', fontSize: '14px'
    },
    error: { color: 'red', fontSize: '12px' },
    button: {
        padding: '12px', backgroundColor: '#007bff', color: 'white',
        border: 'none', borderRadius: '5px', fontSize: '16px',
        cursor: 'pointer'
    }
};

export default LoginPage;