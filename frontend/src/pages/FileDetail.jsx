import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Typography, Descriptions, Tag, Divider, message, Spin } from 'antd';
import { DownloadOutlined, ArrowLeftOutlined, FileOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const FileDetail = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchFileDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/files/${id}`);
        setFile(response.data);
      } catch (error) {
        console.error('获取文件详情失败:', error);
        message.error('获取文件详情失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFileDetail();
    }
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      // 增加下载计数
      await axios.post(`/files/${id}/download`);
      
      // 获取下载链接并触发下载
      const response = await axios.get(`/files/${id}/download`, {
        responseType: 'blob'
      });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('下载开始');
    } catch (error) {
      console.error('下载失败:', error);
      message.error('下载失败，请稍后再试');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!file) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <FileOutlined style={{ fontSize: 64, color: '#ccc' }} />
        <Title level={3}>文件不存在或已被删除</Title>
        <Button type="primary">
          <Link to="/files"><ArrowLeftOutlined /> 返回文件列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="file-detail-container">
      <Button style={{ marginBottom: 16 }}>
        <Link to="/files"><ArrowLeftOutlined /> 返回文件列表</Link>
      </Button>
      
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <FileOutlined style={{ fontSize: 48, color: '#1890ff', marginRight: 16 }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>{file.name}</Title>
            <Tag color="blue">{file.category}</Tag>
            <Tag color="green">{file.size} MB</Tag>
          </div>
        </div>
        
        <Divider />
        
        <Descriptions title="文件信息" bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item label="上传时间">{new Date(file.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="下载次数">{file.downloads}</Descriptions.Item>
          <Descriptions.Item label="文件大小">{file.size} MB</Descriptions.Item>
          <Descriptions.Item label="文件类型">{file.fileType}</Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Title level={4}>文件描述</Title>
        <Paragraph>
          {file.description || '暂无描述'}
        </Paragraph>
        
        <Divider />
        
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            size="large"
            loading={downloading}
            onClick={handleDownload}
          >
            下载文件
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FileDetail;