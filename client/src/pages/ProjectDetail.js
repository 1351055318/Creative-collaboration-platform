import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Card, Tag, Spin, message, 
  Tabs, Avatar, Divider, Upload, List, 
  Form, Input, Space, Modal, Popconfirm
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, UploadOutlined, 
  TeamOutlined, UserOutlined, SendOutlined
} from '@ant-design/icons';
import { getProject, deleteProject, uploadMedia } from '../utils/projectApi';
import { getProjectComments, addComment, deleteComment } from '../utils/commentApi';
import io from 'socket.io-client';
import styled from 'styled-components';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ProjectStatus = styled(Tag)`
  margin-left: 8px;
`;

const ProjectTags = styled.div`
  margin-top: 16px;
  margin-bottom: 24px;
`;

const CollaboratorCard = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const MediaCard = styled(Card)`
  height: 100%;
  .ant-card-body {
    padding: 12px;
  }
  .media-caption {
    margin-top: 8px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
  .media-actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
`;

// 自定义评论组件
const CommentComponent = ({ author, avatar, content, datetime, actions }) => {
  return (
    <div style={{ display: 'flex', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ marginRight: '12px' }}>
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div>
          <strong>{author}</strong>
          <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: '8px' }}>{datetime}</span>
        </div>
        <div style={{ margin: '8px 0' }}>{content}</div>
        {actions && actions.length > 0 && (
          <div>{actions}</div>
        )}
      </div>
    </div>
  );
};

const ProjectDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);

  useEffect(() => {
    // 获取项目数据
    fetchProject();
    fetchComments();

    // 设置Socket.IO连接
    const newSocket = io();
    setSocket(newSocket);

    // 加入项目房间
    newSocket.emit('join-project', id);

    // 监听项目更新
    newSocket.on('project-updated', (data) => {
      if (data.projectId === id) {
        if (data.type === 'new-comment') {
          fetchComments();
        } else {
          fetchProject();
        }
      }
    });

    // 清理函数
    return () => {
      newSocket.emit('leave-project', id);
      newSocket.disconnect();
    };
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (error) {
      message.error('获取项目失败: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getProjectComments(id);
      setComments(data);
    } catch (error) {
      message.error('获取评论失败: ' + error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id);
      message.success('项目已删除');
      navigate('/dashboard');
    } catch (error) {
      message.error('删除项目失败: ' + error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentValue.trim()) return;

    setCommentLoading(true);
    
    try {
      const newComment = await addComment(id, commentValue);
      setComments([newComment, ...comments]);
      setCommentValue('');
      
      // 通知其他用户有新评论
      if (socket) {
        socket.emit('project-update', {
          projectId: id,
          type: 'new-comment',
          data: newComment
        });
      }
    } catch (error) {
      message.error('添加评论失败: ' + error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
      message.success('评论已删除');
    } catch (error) {
      message.error('删除评论失败: ' + error);
    }
  };

  const handleMediaUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    
    setMediaUploadLoading(true);
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('media', file);
    
    try {
      // 获取认证令牌
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('未认证，请先登录');
      }
      
      // 第一步：先上传文件到服务器获取URL
      const response = await axios.post(`/api/upload/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ percent });
          }
        }
      });
      
      // 确保文件上传成功且返回了文件信息
      if (!response.data || !response.data.file) {
        throw new Error('服务器返回的文件信息无效');
      }
      
      // 获取上传的文件信息
      const fileInfo = response.data.file;
      console.log('文件上传成功，信息:', fileInfo);
      
      // 第二步：将文件信息添加到项目中
      // 确保包含所有必要字段
      const mediaData = {
        type: fileInfo.type,
        url: fileInfo.url,
        caption: file.name || '未命名文件'
      };
      
      console.log('添加到项目的媒体数据:', mediaData);
      
      // 使用项目API将媒体信息添加到项目
      const mediaResponse = await uploadMedia(id, mediaData);
      console.log('媒体添加到项目成功:', mediaResponse);
      
      // 更新项目数据
      fetchProject();
      
      // 调用成功回调
      onSuccess(response.data);
      
      message.success('媒体上传成功');
    } catch (error) {
      console.error('媒体上传错误:', error);
      if (onError) {
        onError(error);
      }
      message.error('媒体上传失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setMediaUploadLoading(false);
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

  const renderMediaItem = (media) => {
    switch (media.type) {
      case 'image':
        return <img src={media.url} alt={media.caption || '图片'} style={{ width: '100%', height: 'auto' }} />;
      case 'video':
        return <video src={media.url} controls style={{ width: '100%', height: 'auto' }} />;
      case 'audio':
        return <audio src={media.url} controls style={{ width: '100%' }} />;
      default:
        return <a href={media.url} target="_blank" rel="noopener noreferrer">查看文档</a>;
    }
  };

  // 构建tabs的items配置
  const getTabItems = () => {
    return [
      {
        key: 'details',
        label: '项目详情',
        children: (
          <Card>
            <Paragraph>{project.description}</Paragraph>
            
            <ProjectTags>
              {project.tags && project.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </ProjectTags>
            
            <Divider orientation="left">媒体资料</Divider>
            
            <Upload
              customRequest={handleMediaUpload}
              showUploadList={false}
              disabled={mediaUploadLoading}
            >
              <Button 
                icon={<UploadOutlined />}
                loading={mediaUploadLoading}
              >
                上传媒体
              </Button>
            </Upload>
            
            {project.media && project.media.length > 0 ? (
              <MediaGrid>
                {project.media.map(media => (
                  <MediaCard key={media._id}>
                    {renderMediaItem(media)}
                    {media.caption && <div className="media-caption">{media.caption}</div>}
                    {(isCreator || project.collaborators.some(c => c._id === user.id)) && (
                      <div className="media-actions">
                        <Popconfirm
                          title="确定要删除此媒体吗？"
                          onConfirm={() => {
                            /* 实现媒体删除 */
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </div>
                    )}
                  </MediaCard>
                ))}
              </MediaGrid>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', marginTop: 16 }}>
                <p>尚未上传媒体文件</p>
              </div>
            )}
          </Card>
        )
      },
      {
        key: 'collaborators',
        label: '协作者',
        children: (
          <Card>
            <div style={{ marginBottom: 20 }}>
              <Button 
                type="primary" 
                icon={<TeamOutlined />}
              >
                邀请协作者
              </Button>
            </div>

            <Divider orientation="left">项目创建者</Divider>
            <CollaboratorCard>
              <Avatar 
                src={project.creator.profile?.avatar} 
                icon={!project.creator.profile?.avatar && <UserOutlined />}
              />
              <span style={{ marginLeft: 12 }}>{project.creator.username}</span>
            </CollaboratorCard>

            <Divider orientation="left">协作者</Divider>
            {project.collaborators && project.collaborators.length > 0 ? (
              project.collaborators.map(collaborator => (
                <CollaboratorCard key={collaborator._id}>
                  <Avatar 
                    src={collaborator.profile?.avatar} 
                    icon={!collaborator.profile?.avatar && <UserOutlined />}
                  />
                  <span style={{ marginLeft: 12 }}>{collaborator.username}</span>
                  {isCreator && (
                    <Button 
                      danger 
                      type="text" 
                      size="small"
                      style={{ marginLeft: 'auto' }}
                    >
                      移除
                    </Button>
                  )}
                </CollaboratorCard>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p>尚未添加协作者</p>
              </div>
            )}
          </Card>
        )
      },
      {
        key: 'discussion',
        label: '讨论',
        children: (
          <Card>
            <Form>
              <Form.Item>
                <TextArea 
                  rows={4} 
                  value={commentValue}
                  onChange={e => setCommentValue(e.target.value)}
                  placeholder="发表您的评论..."
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  htmlType="submit" 
                  loading={commentLoading} 
                  onClick={handleCommentSubmit}
                  type="primary"
                  icon={<SendOutlined />}
                  disabled={!commentValue.trim()}
                >
                  发表评论
                </Button>
              </Form.Item>
            </Form>
            
            <Divider />
            
            <List
              className="comment-list"
              header={`${comments.length} 条评论`}
              itemLayout="horizontal"
              dataSource={comments}
              locale={{ emptyText: '暂无评论' }}
              renderItem={item => (
                <CommentComponent
                  author={item.author?.username || '用户已删除'}
                  avatar={
                    <Avatar 
                      src={item.author?.profile?.avatar} 
                      icon={!item.author?.profile?.avatar && <UserOutlined />}
                    />
                  }
                  content={item.content}
                  datetime={new Date(item.createdAt).toLocaleString()}
                  actions={[
                    (isCreator || item.author?._id === user.id) && (
                      <Popconfirm
                        key="delete"
                        title="确定要删除这条评论吗？"
                        onConfirm={() => handleCommentDelete(item._id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="text" danger size="small">删除</Button>
                      </Popconfirm>
                    )
                  ].filter(Boolean)}
                />
              )}
            />
          </Card>
        )
      }
    ];
  };

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

  // 检查当前用户是否是项目创建者
  const isCreator = project.creator._id === user.id;

  return (
    <div>
      <ProjectHeader>
        <div>
          <Title level={2}>
            {project.title}
            <ProjectStatus color={getStatusColor(project.status)}>
              {getStatusText(project.status)}
            </ProjectStatus>
          </Title>
          <Text type="secondary">
            创建者: {project.creator.username}
          </Text>
        </div>
        <div>
          {isCreator && (
            <Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/projects/${id}/edit`)}
              >
                编辑项目
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={() => setDeleteModalVisible(true)}
              >
                删除项目
              </Button>
            </Space>
          )}
        </div>
      </ProjectHeader>

      <Tabs defaultActiveKey="details" items={getTabItems()} />
      
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDeleteProject}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认删除"
        cancelText="取消"
      >
        <p>您确定要删除此项目吗？此操作不可撤销。</p>
      </Modal>
    </div>
  );
};

export default ProjectDetail; 