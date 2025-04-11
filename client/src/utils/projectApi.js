import axios from 'axios';

const API_URL = '/api/projects';

// 获取所有项目
export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取项目失败';
  }
};

// 获取单个项目详情
export const getProject = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取项目详情失败';
  }
};

// 创建新项目
export const createProject = async (projectData) => {
  try {
    const response = await axios.post(API_URL, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '创建项目失败';
  }
};

// 更新项目
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await axios.put(`${API_URL}/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '更新项目失败';
  }
};

// 删除项目
export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '删除项目失败';
  }
};

// 上传项目媒体
export const uploadMedia = async (projectId, mediaData) => {
  try {
    // 获取存储的认证令牌
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未认证，请先登录');
    }
    
    // 检查必要的媒体信息
    if (!mediaData.type || !mediaData.url) {
      throw new Error('缺少必要的媒体信息 (type, url)');
    }
    
    // 确保Content-Type是JSON
    const response = await axios.post(`${API_URL}/${projectId}/media`, mediaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('媒体上传错误:', error);
    throw error.response?.data?.message || '上传媒体失败';
  }
};

// 添加协作者
export const addCollaborator = async (projectId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/${projectId}/collaborators`, { userId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '添加协作者失败';
  }
};

// 移除协作者
export const removeCollaborator = async (projectId, userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${projectId}/collaborators/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '移除协作者失败';
  }
}; 