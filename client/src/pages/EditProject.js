import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, Input, Button, Select, message, Card, 
  Typography, Spin, Space, Tag
} from 'antd';
import { getProject, updateProject } from '../utils/projectApi';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // 获取项目数据
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await getProject(id);
        setProject(data);
        setTags(data.tags || []);
        
        // 设置表单初始值
        form.setFieldsValue({
          title: data.title,
          description: data.description,
          status: data.status
        });
      } catch (error) {
        message.error('获取项目失败: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, form]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    
    try {
      // 将标签添加到提交数据中
      const updatedData = {
        ...values,
        tags
      };
      
      await updateProject(id, updatedData);
      message.success('项目更新成功');
      navigate(`/projects/${id}`);
    } catch (error) {
      message.error('更新项目失败: ' + error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (removedTag) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block', marginBottom: '8px' }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={3}>项目不存在或已被删除</Title>
        <Button onClick={() => navigate('/dashboard')}>
          返回我的项目
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Title level={2}>编辑项目</Title>
      
      <Card style={{ marginTop: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="项目标题"
            rules={[{ required: true, message: '请输入项目标题' }]}
          >
            <Input placeholder="输入项目标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea 
              placeholder="输入项目详细描述" 
              rows={6}
            />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="项目状态"
            rules={[{ required: true, message: '请选择项目状态' }]}
          >
            <Select placeholder="选择项目状态">
              <Option value="draft">草稿</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="标签">
            <div>
              {tagChild}
              {inputVisible && (
                <Input
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                  autoFocus
                />
              )}
              {!inputVisible && (
                <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  + 新标签
                </Tag>
              )}
            </div>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={submitting}
              >
                保存更改
              </Button>
              <Button onClick={() => navigate(`/projects/${id}`)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProject; 