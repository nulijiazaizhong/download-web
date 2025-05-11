import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Upload, Select, message, Popconfirm, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminFiles = () => {
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 获取文件列表
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/files');
      setFiles(response.data);
    } catch (error) {
      console.error('获取文件列表失败:', error);
      message.error('获取文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchCategories();
  }, []);

  // 处理文件上传
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });
    
    // 添加表单数据
    const values = await form.validateFields();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });

    try {
      setUploading(true);
      await axios.post('/admin/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      message.success('文件上传成功');
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchFiles(); // 刷新文件列表
    } catch (error) {
      console.error('上传失败:', error);
      message.error('文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 处理文件编辑
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/admin/files/${editingFile._id}`, values);
      message.success('文件信息更新成功');
      setModalVisible(false);
      fetchFiles(); // 刷新文件列表
    } catch (error) {
      console.error('更新失败:', error);
      message.error('文件信息更新失败');
    }
  };

  // 处理文件删除
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/files/${id}`);
      message.success('文件删除成功');
      fetchFiles(); // 刷新文件列表
    } catch (error) {
      console.error('删除失败:', error);
      message.error('文件删除失败');
    }
  };

  // 打开添加文件模态框
  const showAddModal = () => {
    setEditingFile(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  // 打开编辑文件模态框
  const showEditModal = (file) => {
    setEditingFile(file);
    form.setFieldsValue({
      name: file.name,
      description: file.description,
      category: file.category,
    });
    setModalVisible(true);
  };

  // 上传组件属性
  const uploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

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
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个文件吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-files">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>文件管理</Title>
        <Button type="primary" onClick={showAddModal}>
          上传新文件
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={files} 
        rowKey="_id" 
        loading={loading}
      />

      <Modal
        title={editingFile ? '编辑文件' : '上传新文件'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={uploading}
            onClick={editingFile ? handleEdit : handleUpload}
          >
            {editingFile ? '保存' : '上传'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="文件名称"
            rules={[{ required: true, message: '请输入文件名称' }]}
          >
            <Input placeholder="请输入文件名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="文件描述"
            rules={[{ required: true, message: '请输入文件描述' }]}
          >
            <TextArea rows={4} placeholder="请输入文件描述" />
          </Form.Item>

          <Form.Item
            name="category"
            label="文件分类"
            rules={[{ required: true, message: '请选择文件分类' }]}
          >
            <Select placeholder="请选择文件分类">
              {categories.map(category => (
                <Option key={category._id} value={category.name}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {!editingFile && (
            <Form.Item
              label="上传文件"
              rules={[{ required: true, message: '请上传文件' }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
              <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                支持各种格式的文件，单个文件大小不超过100MB
              </Text>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminFiles;