import React, { createContext, useState } from 'react';

// Tạo một Context với giá trị mặc định
const AdminContext = createContext();

// Tạo một Provider để bao bọc các component con cần truy cập giá trị từ Context
const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AdminContext.Provider value={{ user, setUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminProvider };
