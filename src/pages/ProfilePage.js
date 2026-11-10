import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FormField from '../components/FormField';
import { getProfile, updateProfile } from '../data/api';
import ChangePasswordForm from '../components/ChangePasswordForm';

function ProfilePage() {
    const { token, updateCustomer } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm({
        defaultValues: { firstName: '', lastName: '', phone: '', city: '', country: '' }
    });

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); 
        useEffect(() => {
        getProfile(token)
            .then(data => {
                setEmail(data.email);
                reset({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    city: data.city,
                    country: data.country
                });
                setLoading(false);
            })
            .catch(err => {
                setMessage({ type: 'error', text: err.message });
                setLoading(false);
            });
    }, [token, reset]);

        const onSubmit = async (formData) => {
        setMessage(null);
        try {
            const updated = await updateProfile(formData, token);
            updateCustomer(updated);
            reset(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (loading) return (
        <div><Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}><h3>Loading profile...</h3></div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2> Myy Profile</h2>

                <div style={styles.card}>
                    <h4>Edit Profile</h4>

                    {message && (
                        <div style={message.type === 'success' ? styles.success : styles.errorBox}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                        <div style={styles.row}>
                            <FormField
                                label="First Name"
                                name="firstName"
                                register={register}
                                error={errors.firstName}
                                rules={{
                                    required: 'First name is required',
                                    minLength: { value: 2, message: 'At least 2 characters' },
                                    maxLength: { value: 50, message: 'At most 50 characters' }
                                }}
                            />
                            <FormField
                                label="Last Name"
                                name="lastName"
                                register={register}
                                error={errors.lastName}
                                rules={{
                                    required: 'Last name is required',
                                    minLength: { value: 2, message: 'At least 2 characters' },
                                    maxLength: { value: 50, message: 'At most 50 characters' }
                                }}
                            />
                        </div>
                        <div style={styles.emailField}>
                            <label>Email (cannot be changed)</label>
                            <input style={styles.emailInput} type="text" value={email} readOnly />
                        </div>

                        <FormField
                            label="Phone"
                            name="phone"
                            register={register}
                            error={errors.phone}
                            rules={{
                                required: 'Phone is required',
                                pattern: {
                                    value: /^\+?\d{9,15}$/,
                                    message: 'Enter a valid phone number (9-15 digits)'
                                }
                            }}
                        />

                        <div style={styles.row}>
                            <FormField
                                label="City"
                                name="city"
                                register={register}
                                error={errors.city}
                                rules={{ required: 'City is required' }}
                            />
                            <FormField
                                label="Country"
                                name="country"
                                register={register}
                                error={errors.country}
                                rules={{ required: 'Country is required' }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...styles.button,
                                opacity: (isSubmitting || !isDirty) ? 0.6 : 1
                            }}
                            disabled={isSubmitting || !isDirty}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
                <ChangePasswordForm token={token} />
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px 30px', maxWidth: '600px', margin: '0 auto' },
    card: { backgroundColor: 'white', borderRadius: '10px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', gap: '15px' },
    emailField: { display: 'flex', flexDirection: 'column', gap: '5px' },
    emailInput: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#f0f0f0' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
    success: { backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '10px' },
    errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '10px' }
};

export default ProfilePage;