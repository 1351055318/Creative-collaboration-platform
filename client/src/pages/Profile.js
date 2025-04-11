import React, { useState } from 'react';
import { 
  Typography, Form, Input, Button, Avatar, 
  Upload, Card, Divider, message, Select
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { updateProfile } from '../utils/auth';
import axios from 'axios';
import styled from 'styled-components';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
`;

const AvatarUpload = styled(Upload)`
  .ant-upload-select-picture-card {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
`;

const Profile = ({ user, setUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user?.profile?.avatar || null);

  // 兴趣列表选项
  const interestOptions = [
    '设计', '艺术', '音乐', '文学', '摄影', '电影',
    '编程', '科技', '创业', '营销', '教育', '环保'
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 包含头像在内的个人资料更新
      const updatedProfile = {
        ...values,
        profile: {
          ...values.profile,
          avatar
        }
      };
      
      const updatedUser = await updateProfile(updatedProfile);
      setUser(updatedUser);
      message.success('个人资料更新成功！');
    } catch (error) {
      message.error('更新失败: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // 假设服务器返回的是文件URL
      setAvatar(info.file.response.url);
      message.success('头像上传成功！');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败！');
      console.error('上传错误:', info.file.error);
    }
  };

  // 自定义上传方法
  const customUploadRequest = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent });
        }
      });
      
      onSuccess(response.data);
    } catch (error) {
      console.error('头像上传失败:', error);
      onError(error);
    }
  };

  return (
    <div className="profile-container">
      <Title level={2}>个人资料</Title>
      
      <Card>
        <ProfileHeader>
          <div>
            {avatar ? (
              <Avatar 
                src={avatar} 
                size={100}
              />
            ) : (
              <Avatar 
                icon={<UserOutlined />} 
                size={100}
              />
            )}
          </div>
          <div>
            <Title level={3}>{user?.username}</Title>
            <p>{user?.email}</p>
          </div>
        </ProfileHeader>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user?.username,
            email: user?.email,
            profile: {
              bio: user?.profile?.bio || '',
              interests: user?.profile?.interests || []
            }
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input placeholder="邮箱" disabled />
          </Form.Item>

          <Form.Item
            label="头像"
          >
            <AvatarUpload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={customUploadRequest}
              onChange={handleAvatarChange}
            >
              {avatar ? (
                <img src={avatar} alt="头像" style={{ width: '100%' }} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </AvatarUpload>
          </Form.Item>

          <Form.Item
            name={['profile', 'bio']}
            label="个人简介"
          >
            <TextArea 
              placeholder="介绍一下你自己..." 
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name={['profile', 'interests']}
            label="兴趣爱好"
          >
            <Select
              mode="multiple"
              placeholder="选择你的兴趣爱好"
              style={{ width: '100%' }}
            >
              {interestOptions.map(interest => (
                <Option key={interest} value={interest}>
                  {interest}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              保存更改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 