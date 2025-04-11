# 灵感花园 - 创意协作平台

![灵感花园](./docs/images/banner.png)

灵感花园（Inspiration Garden）是一个面向创意人士的协作平台，帮助设计师、艺术家、作家和开发者等创意工作者共享灵感、协作项目和实现创意构想。平台提供了直观的项目管理工具、实时协作功能和多样化的媒体支持，为创意协作提供了一站式解决方案。

## 项目特点

- 🔐 **完善的用户认证系统**：安全的注册、登录、个人资料管理
- 📂 **创意项目管理**：创建、编辑、组织和分类您的创意项目
- 🤝 **实时协作功能**：与团队成员实时交流和协作
- 📊 **项目状态跟踪**：项目进度可视化，明确项目阶段
- 🖼️ **多媒体支持**：上传、展示和管理各种媒体资源
- 💬 **讨论与反馈**：针对项目的讨论和反馈系统
- 📱 **响应式设计**：在各种设备上都能获得出色的体验

## 技术栈

### 后端
- **Node.js** & **Express**: 构建RESTful API
- **MongoDB**: 数据存储
- **Socket.io**: 实时通信
- **JWT**: 用户认证和授权
- **Multer**: 文件上传处理

### 前端
- **React**: 用户界面构建
- **Ant Design**: UI组件库
- **Axios**: API请求
- **Socket.io-client**: 实时功能
- **Styled-components**: 组件样式定制

## 功能演示

### 项目仪表盘
![项目仪表盘](./docs/images/dashboard.png)

### 项目详情页
![项目详情](./docs/images/project-detail.png)

### 协作与讨论
![协作功能](./docs/images/collaboration.png)

## 安装与使用

### 前提条件

- Node.js (v14.0.0+)
- MongoDB (v4.0.0+)
- npm或yarn

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/1351055318/Creative-collaboration-platform.git
cd Creative-collaboration-platform
```

2. **安装依赖**
```bash
# 安装服务器依赖
npm install

# 安装客户端依赖
cd client
npm install
cd ..
```

3. **配置环境变量**

创建 `.env` 文件并添加以下内容：
```
MONGODB_URI=mongodb://localhost:27017/inspiration-garden
JWT_SECRET=your-secret-key
PORT=5000
```

4. **创建必要目录并准备初始数据**
```bash
# 创建上传目录
mkdir -p uploads/avatars uploads/media

# 填充示例数据（可选）
npm run seed
```

5. **启动应用**
```bash
# 在一个终端窗口启动服务器
npm run dev

# 在另一个终端窗口启动前端
cd client
npm start
```

6. **访问应用**

打开浏览器，访问 `http://localhost:3000` 开始使用灵感花园平台。

### 测试账号

运行种子数据脚本后，系统中将创建以下测试用户：

1. 创意设计师
   - 用户名: creative_mind
   - 邮箱: creative@example.com
   - 密码: password123

2. 技术创新者
   - 用户名: tech_innovator
   - 邮箱: tech@example.com
   - 密码: password123

3. 故事讲述者
   - 用户名: story_teller
   - 邮箱: story@example.com
   - 密码: password123

## API文档

### 用户认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户个人资料

### 项目管理
- `GET /api/projects` - 获取所有项目
- `POST /api/projects` - 创建新项目
- `GET /api/projects/:id` - 获取单个项目
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

### 项目协作
- `POST /api/projects/:id/collaborators` - 添加协作者
- `DELETE /api/projects/:id/collaborators/:userId` - 移除协作者

### 媒体管理
- `POST /api/upload/avatar` - 上传用户头像
- `POST /api/upload/media` - 上传项目媒体
- `POST /api/projects/:id/media` - 添加媒体到项目
- `DELETE /api/projects/:id/media/:mediaId` - 从项目中删除媒体

### 评论系统
- `GET /api/comments/project/:projectId` - 获取项目评论
- `POST /api/comments/project/:projectId` - 添加项目评论
- `DELETE /api/comments/:commentId` - 删除评论

## 项目结构

```
inspiration-garden/
├── client/                 # 前端React应用
│   ├── public/             # 静态资源
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── utils/          # 工具函数
│   │   └── App.js          # 应用入口
├── middleware/             # 中间件
├── models/                 # 数据模型
├── routes/                 # API路由
├── seeds/                  # 种子数据
├── uploads/                # 上传文件存储
├── index.js                # 服务器入口
└── README.md               # 项目文档
```

## 协作与贡献

欢迎提交Pull Request来改进项目。请遵循以下步骤：

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 后续计划

我们计划在未来版本中添加以下功能：

- 更高级的权限管理系统
- 项目模板功能
- AI辅助创意生成
- 集成更多第三方工具
- 移动应用版本

## 许可证

本项目采用MIT许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

- 项目创建者: [Your Name](mailto:your.email@example.com)
- 项目仓库: [https://github.com/1351055318/Creative-collaboration-platform](https://github.com/1351055318/Creative-collaboration-platform)

---

<p align="center">🌱 灵感花园 - 让创意自由生长 🌱</p> 