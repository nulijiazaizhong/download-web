import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, List, Tag, Typography, Spin, Empty } from 'antd';
import { SearchOutlined, DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();

  // 从URL获取查询参数
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  // 获取所有分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };

    fetchCategories();
  }, []);

  // 获取文件列表
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        let url = '/files';
        const params = {};
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        
        const response = await axios.get(url, { params });
        setFiles(response.data);
      } catch (error) {
        console.error('获取文件列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [searchTerm, selectedCategory]);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // 处理分类选择
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  return (
    <div className="file-list-container">
      <Title level={2}>文件列表</Title>
      
      <Row gutter={[16, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={16} md={18}>
          <Search
            placeholder="搜索文件名称或描述"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="选择分类"
            style={{ width: '100%' }}
            size="large"
            allowClear
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {categories.map(category => (
              <Option key={category._id} value={category.name}>{category.name}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : files.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={files}
          renderItem={file => (
            <List.Item>
              <Card
                className="file-card"
                cover={
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                    <FileOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                  </div>
                }
                actions={[
                  <Link to={`/files/${file._id}`} key="view">查看详情</Link>,
                  <Link to={`/files/${file._id}`} key="download">
                    <DownloadOutlined /> 下载
                  </Link>
                ]}
              >
                <Card.Meta
                  title={file.name}
                  description={
                    <>
                      <p>{file.description?.substring(0, 50)}...</p>
                      <p>
                        <Tag color="blue">{file.category}</Tag>
                        <span style={{ marginLeft: 8 }}>{file.downloads} 次下载</span>
                      </p>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无文件" />
      )}
    </div>
  );
};

export default FileList;