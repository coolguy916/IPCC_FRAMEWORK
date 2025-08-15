import React from 'react';

const Header = ({ children }) => {
  return (
    <div className="header p-4">
      <div className="d-flex justify-content-between align-items-center">
        {children}
      </div>
    </div>
  );
};

export default Header;