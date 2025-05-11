import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { DownloadOutlined, FileOutlined, UserOutlined, FolderOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    totalUsers: 0,
    totalCategories: 0
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 获取统计数据
        const statsResponse = await axios.get('/admin/stats');
        setStats(statsResponse.data);
        
        // 获取最近上传的文件
        const filesResponse = await axios.get('/files?limit=5&sort=-createdAt');
        setRecentFiles(filesResponse.data);
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${size} MB`,
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '下载次数',
      dataIndex: 'downloads',
      key: 'downloads',
    },
  ];

  return (
    <div className="admin-dashboard">
      <Title level={2}>管理员仪表盘</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总文件数" 
              value={stats.totalFiles} 
              prefix={<FileOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总下载次数" 
              value={stats.totalDownloads} 
              prefix={<DownloadOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="用户数" 
              value={stats.totalUsers} 
              prefix={<UserOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="分类数" 
              value={stats.totalCategories} 
              prefix={<FolderOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>最近上传的文件</Title>
        <Table 
          columns={columns} 
          dataSource={recentFiles} 
          rowKey="_id" 
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;