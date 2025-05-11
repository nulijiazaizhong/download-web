import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 处理添加分类
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('/admin/categories', values);
      message.success('分类添加成功');
      setModalVisible(false);
      form.resetFields();
      fetchCategories(); // 刷新分类列表
    } catch (error) {
      console.error('添加失败:', error);
      message.error('分类添加失败');
    }
  };

  // 处理编辑分类
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/admin/categories/${editingCategory._id}`, values);
      message.success('分类更新成功');
      setModalVisible(false);
      fetchCategories(); // 刷新分类列表
    } catch (error) {
      console.error('更新失败:', error);
      message.error('分类更新失败');
    }
  };

  // 处理删除分类
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/categories/${id}`);
      message.success('分类删除成功');
      fetchCategories(); // 刷新分类列表
    } catch (error) {
      console.error('删除失败:', error);
      message.error('分类删除失败');
    }
  };

  // 打开添加分类模态框
  const showAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑分类模态框
  const showEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '文件数量',
      dataIndex: 'fileCount',
      key: 'fileCount',
      render: (_, record) => record.fileCount || 0,
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
            title="确定要删除这个分类吗？"
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
    <div className="admin-categories">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>分类管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          添加分类
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="_id" 
        loading={loading}
      />

      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={editingCategory ? handleEdit : handleAdd}
          >
            {editingCategory ? '保存' : '添加'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
            rules={[{ required: true, message: '请输入分类描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入分类描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;