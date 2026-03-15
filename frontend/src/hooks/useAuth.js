import { useState } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const getUser = () => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  };

  const user = getUser();
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/signup', { name, email, password });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = signup; // alias used by SignupPage

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return { user, isAuthenticated, isAdmin, login, signup, register, logout, loading };
};