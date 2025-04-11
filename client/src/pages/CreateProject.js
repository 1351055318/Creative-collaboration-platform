import React, { useState } from 'react';
import { Form, Input, Button, Typography, Select, message, Divider } from 'antd';
import { TagsInput } from '../components/TagsInput';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../utils/projectApi';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateProject = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newProject = await createProject(values);
      message.success('项目创建成功！');
      navigate(`/projects/${newProject._id}`);
    } catch (error) {
      message.error('创建项目失败: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2}>创建新项目</Title>
      </div>

      <div className="form-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'draft',
            tags: []
          }}
        >
          <Form.Item
            name="title"
            label="项目标题"
            rules={[{ required: true, message: '请输入项目标题!' }]}
          >
            <Input placeholder="输入项目标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述!' }]}
          >
            <TextArea
              placeholder="描述您的项目"
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="项目状态"
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <TagsInput placeholder="添加标签并按回车确认" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ marginRight: 8 }}
            >
              创建项目
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateProject; 