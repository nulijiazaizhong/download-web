import React from 'react';
import { Typography, Row, Col, Card, Button, List } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  // 模拟热门下载数据
  const popularFiles = [
    { id: 1, name: '热门软件1', downloads: 1200, category: '软件' },
    { id: 2, name: '热门游戏1', downloads: 980, category: '游戏' },
    { id: 3, name: '热门文档1', downloads: 850, category: '文档' },
    { id: 4, name: '热门工具1', downloads: 760, category: '工具' },
  ];

  return (
    <div className="home-container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="hero-section" style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title>下载站管理系统</Title>
            <Paragraph>
              提供各类软件、游戏、文档等资源的下载服务，快速、安全、便捷
            </Paragraph>
            <Button type="primary" size="large">
              <Link to="/files">浏览所有文件</Link>
            </Button>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>热门下载</Title>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
            dataSource={popularFiles}
            renderItem={(item) => (
              <List.Item>
                <Card 
                  title={item.name}
                  className="file-card"
                  actions={[
                    <Link to={`/files/${item.id}`} key="download">
                      <DownloadOutlined /> 下载
                    </Link>
                  ]}
                >
                  <p>分类: {item.category}</p>
                  <p>下载次数: {item.downloads}</p>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
        <Col span={24}>
          <Title level={2}>资源分类</Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6} lg={6}>
              <Card className="category-card">
                <Link to="/files?category=软件">软件</Link>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={6}>
              <Card className="category-card">
                <Link to="/files?category=游戏">游戏</Link>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={6}>
              <Card className="category-card">
                <Link to="/files?category=文档">文档</Link>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={6}>
              <Card className="category-card">
                <Link to="/files?category=工具">工具</Link>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;