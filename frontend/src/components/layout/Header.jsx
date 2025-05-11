import React, { useContext } from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DownloadOutlined, LoginOutlined, UserOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import AuthContext from '../../context/AuthContext';

const { Header } = Layout;

const AppHeader = () => {
  const { isAuthenticated, isAdmin, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo">
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            <DownloadOutlined /> 下载站
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: '64px', flex: 1 }}
        >
          <Menu.Item key="/">
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="/files">
            <Link to="/files">文件列表</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="/admin">
              <Link to="/admin">管理后台</Link>
            </Menu.Item>
          )}
        </Menu>
      </div>
      
      <div>
        {isAuthenticated ? (
          <Space>
            <span style={{ color: '#fff' }}>
              <UserOutlined /> {user?.username}
            </span>
            <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout}>
              退出
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type="link" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/register')}>
              注册
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;