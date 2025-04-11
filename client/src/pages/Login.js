import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

const { Title } = Typography;

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await login(values);
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <Title level={2} className="auth-form-title">登录</Title>
      
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入您的邮箱!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="邮箱" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入您的密码!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="form-button"
            loading={loading}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      
      <div className="form-bottom-text">
        还没有账号？ <Link to="/register">立即注册</Link>
      </div>
    </div>
  );
};

export default Login; 