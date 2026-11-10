import React from 'react';

function FormField({ label, name, register, rules, error, type = 'text', readOnly = false, placeholder }) {
    return (
        <div style={styles.field}>
            <label>{label}</label>
            <input
                style={{
                    ...styles.input,
                    borderColor: error ? 'red' : '#ddd',
                    backgroundColor: readOnly ? '#f0f0f0' : 'white'
                }}
                type={type}
                readOnly={readOnly}
                placeholder={placeholder}
                {...register(name, rules)}
            />
            {error && <span style={styles.error}>{error.message}</span>}
        </div>
    );
}

const styles = {
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
    error: { color: 'red', fontSize: '12px' }
};

export default FormField;