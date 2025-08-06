import React from 'react';

//layout for consistent background
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
};

export default Layout;