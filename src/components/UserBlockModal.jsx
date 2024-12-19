import React from 'react';

const UserBlockModal = ({ onClose }) => {
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>User Blocked</h3>
                <p>Your account has been blocked. Please contact support for more information.</p>
                <button onClick={onClose} className="btn btn-primary">Close</button>
            </div>
        </div>
    );
};

export default UserBlockModal;
