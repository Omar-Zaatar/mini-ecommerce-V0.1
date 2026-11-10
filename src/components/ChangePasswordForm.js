import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from './FormField';
import { changePassword } from '../data/api';

function ChangePasswordForm({ token }) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
    });

    const [message, setMessage] = useState(null);     const [showPasswords, setShowPasswords] = useState(false);

    const inputType = showPasswords ? 'text' : 'password';

        const onSubmit = async (formData) => {
        setMessage(null);
        try {
                        await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, token);

            reset();               setMessage({ type: 'success', text: 'Password changed successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div style={styles.card}>
            <h4>Change Password</h4>

            {message && (
                <div style={message.type === 'success' ? styles.success : styles.errorBox}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                <FormField
                    label="Current Password"
                    name="currentPassword"
                    type={inputType}
                    register={register}
                    error={errors.currentPassword}
                    rules={{ required: 'Current password is required' }}
                />

                <FormField
                    label="New Password"
                    name="newPassword"
                    type={inputType}
                    register={register}
                    error={errors.newPassword}
                    rules={{
                        required: 'New password is required',
                        minLength: { value: 8, message: 'At least 8 characters' },
                        validate: {
                            hasLetterAndNumber: (value) =>
                                /^(?=.*[A-Za-z])(?=.*\d)/.test(value) ||
                                'Use at least one letter and one number',
                            differentFromCurrent: (value) =>
                                value !== getValues('currentPassword') ||
                                'New password must be different from the current one'
                        }
                    }}
                />

                <FormField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={inputType}
                    register={register}
                    error={errors.confirmPassword}
                    rules={{
                        required: 'Please confirm the new password',
                        validate: (value) =>
                            value === getValues('newPassword') || 'Passwords do not match'
                    }}
                />

                <label style={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                    />
                    Show passwords
                </label>

                <button
                    type="submit"
                    style={{ ...styles.button, opacity: isSubmitting ? 0.6 : 1 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    card: { backgroundColor: 'white', borderRadius: '10px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
    success: { backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '10px' },
    errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '10px' }
};

export default ChangePasswordForm;