import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logoutUser } from '../api/user.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      // getCurrentUser returns req.user = JWT payload { userId, username, email, ... }
      const userData = res.data;
      if (userData?.userId && !userData._id) userData._id = userData.userId;
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = (userData) => {
    if (userData?.userId && !userData._id) userData._id = userData.userId;
    setUser(userData);
  };

  const logout = async () => {
    try { await logoutUser(); } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
