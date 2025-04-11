const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 检查授权头
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('未提供授权头');
      return res.status(401).json({ message: '未提供认证令牌' });
    }
    
    // 尝试提取令牌
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('授权头格式不正确');
      return res.status(401).json({ message: '令牌格式不正确' });
    }
    
    // 验证令牌
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // 将用户信息添加到请求对象
    req.user = decoded;
    
    // 调试信息
    console.log(`已验证用户: ${decoded.userId}`);
    
    next();
  } catch (error) {
    console.error('认证中间件错误:', error.message);
    res.status(401).json({ message: '认证失败', error: error.message });
  }
}; 