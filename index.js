const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

// 导入路由
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');
const commentRoutes = require('./routes/comments');
const authMiddleware = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 数据库连接
mongoose.connect('mongodb://localhost:27017/inspiration-garden', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('数据库连接成功'))
.catch(err => console.error('数据库连接失败:', err));

// 配置路由
app.get('/', (req, res) => {
  res.send('欢迎来到灵感花园！');
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
// 所有上传API都需要认证
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/comments', authMiddleware, commentRoutes);

// 为前端提供静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log('新用户连接');
  
  // 处理加入项目房间
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`用户加入项目：${projectId}`);
  });
  
  // 处理离开项目房间
  socket.on('leave-project', (projectId) => {
    socket.leave(`project-${projectId}`);
    console.log(`用户离开项目：${projectId}`);
  });
  
  // 处理项目更新
  socket.on('project-update', (data) => {
    socket.to(`project-${data.projectId}`).emit('project-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('用户断开连接');
  });
});

// 启动服务器
// 将端口改为5000，避免与React前端的3000端口冲突
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 