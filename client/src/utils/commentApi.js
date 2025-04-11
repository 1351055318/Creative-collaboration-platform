import axios from 'axios';

const API_URL = '/api/comments';

// 获取项目的所有评论
export const getProjectComments = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '获取评论失败';
  }
};

// 添加评论
export const addComment = async (projectId, content) => {
  try {
    const response = await axios.post(`${API_URL}/project/${projectId}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '添加评论失败';
  }
};

// 删除评论
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || '删除评论失败';
  }
}; 