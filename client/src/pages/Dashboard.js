import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Tag, Empty, Spin, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../utils/projectApi';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const ProjectStatus = styled(Tag)`
  margin-bottom: 8px;
`;

const ProjectTags = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      message.error('获取项目失败: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      message.success('项目已删除');
      setProjects(projects.filter(project => project._id !== projectId));
    } catch (error) {
      message.error('删除项目失败: ' + error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'default';
      case 'in-progress': return 'processing';
      case 'completed': return 'success';
      case 'archived': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'in-progress': return '进行中';
      case 'completed': return '已完成';
      case 'archived': return '已归档';
      default: return '未知状态';
    }
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2}>我的项目</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/projects/new')}
        >
          创建新项目
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <Empty 
          description="您还没有创建任何项目" 
          style={{ margin: '50px 0' }}
        >
          <Button 
            type="primary" 
            onClick={() => navigate('/projects/new')}
          >
            创建第一个项目
          </Button>
        </Empty>
      ) : (
        <div className="card-grid">
          {projects.map(project => (
            <Card
              key={project._id}
              className="project-card"
              actions={[
                <Link to={`/projects/${project._id}`} key="view">
                  <EyeOutlined /> 查看
                </Link>,
                <Link to={`/projects/${project._id}/edit`} key="edit">
                  <EditOutlined /> 编辑
                </Link>,
                <DeleteOutlined 
                  key="delete" 
                  onClick={() => handleDeleteProject(project._id)}
                />
              ]}
            >
              <div>
                <ProjectStatus color={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </ProjectStatus>
                <Meta
                  title={project.title}
                  description={
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {project.description}
                    </Paragraph>
                  }
                />
                <ProjectTags>
                  {project.tags && project.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </ProjectTags>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 