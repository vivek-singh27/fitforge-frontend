import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem('fitforge_token');
    const userData = localStorage.getItem('fitforge_user');
    if (token && userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    localStorage.setItem('fitforge_token', data.token);
    localStorage.setItem('fitforge_user', JSON.stringify({
      username: data.username,
      email: data.email,
      role: data.role,
    }));
    setUser({ username: data.username, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('fitforge_token');
    localStorage.removeItem('fitforge_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);