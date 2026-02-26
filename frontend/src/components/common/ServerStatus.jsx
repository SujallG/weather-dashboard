// frontend/src/components/common/ServerStatus.jsx
import React from 'react';
import './ServerStatus.css';

const ServerStatus = ({ status }) => {
  if (status === 'online') return null;

  return (
    <div className="server-status warning">
      <span className="status-icon">⚠️</span>
      <span className="status-message">
        Cannot connect to server. Please make sure backend is running on port 3000.
      </span>
    </div>
  );
};

export default ServerStatus;