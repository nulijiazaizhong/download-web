import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从本地存储加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // 设置请求头
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 获取用户信息
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError(err.response?.data?.message || '加载用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 用户注册
  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      message.success('注册成功');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || '注册失败');
      message.error(err.response?.data?.message || '注册失败');
      return false;
    }
  };

  // 用户登录
  const login = async (userData) => {
    try {
      const res = await axios.post('/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      message.success('登录成功');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || '登录失败');
      message.error(err.response?.data?.message || '登录失败');
      return false;
    }
  };

  // 用户登出
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    message.success('已退出登录');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;