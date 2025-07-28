import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div style={{ 
      background: 'white', 
      borderBottom: '1px solid #ddd', 
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1>My Notes</h1>
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '20px', 
            width: '40px', 
            height: '40px' 
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </button>
        {showDropdown && (
          <div style={{ 
            position: 'absolute', 
            right: 0, 
            top: '45px', 
            background: 'white', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            minWidth: '150px',
            zIndex: 1000
          }}>
            <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              {user?.email}
            </div>
            <button 
              onClick={logout}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: 'none', 
                background: 'none', 
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;