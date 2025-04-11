import axios from 'axios';

// 设置请求基础URL
const API_URL = '/api';

// 设置axios默认请求头的token
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// 注册用户
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    
    setAuthToken(token);
    return user;
  } catch (error) {
    throw error.response?.data?.message || '注册失败';
  }
};

// 用户登录
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    const { token, user } = response.data;
    
    setAuthToken(token);
    return user;
  } catch (error) {
    throw error.response?.data?.message || '登录失败';
  }
};

// 用户登出
export const logout = () => {
  setAuthToken(null);
};

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  try {
    // 检查是否有保存的token
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // 设置token到请求头
    setAuthToken(token);
    
    try {
      // 从服务器获取用户信息
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data.user;
    } catch (error) {
      console.log('获取用户信息失败，可能是API路径问题或服务器没启动');
      // 在开发阶段，如果接口不可用，返回模拟用户数据
      if (process.env.NODE_ENV === 'development') {
        // 返回模拟用户数据以便继续开发
        return {
          id: '12345',
          username: 'devUser',
          email: 'dev@example.com',
          profile: {
            avatar: null,
            bio: '开发测试账号',
            interests: ['开发', '测试']
          }
        };
      }
      // 正式环境中清除token
      setAuthToken(null);
      return null;
    }
  } catch (error) {
    // 如果请求失败，清除token
    setAuthToken(null);
    return null;
  }
};

// 更新用户个人资料
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/profile`, profileData);
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || '更新个人资料失败';
  }
}; 