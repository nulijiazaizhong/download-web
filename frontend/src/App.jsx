import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, message } from 'antd';
import axios from 'axios';

// 组件导入
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FileList from './pages/FileList';
import FileDetail from './pages/FileDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFiles from './pages/admin/Files';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import NotFound from './pages/NotFound';

// 上下文
import { AuthProvider } from './context/AuthContext';

// API 基础URL
axios.defaults.baseURL = 'http://localhost:5000/api';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/files" element={<FileList />} />
              <Route path="/files/:id" element={<FileDetail />} />
              
              {/* 管理员路由 */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/files" element={<AdminFiles />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </div>
        </Content>
        <Footer />
      </Layout>
    </AuthProvider>
  );
}

export default App;