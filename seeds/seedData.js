const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

// 确保上传目录存在
const ensureDirectoriesExist = () => {
  const directories = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/avatars'),
    path.join(__dirname, '../uploads/media')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`已创建目录: ${dir}`);
    }
  });
};

// 连接数据库
mongoose.connect('mongodb://localhost:27017/inspiration-garden', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('数据库连接成功，开始填充数据'))
.catch(err => console.error('数据库连接失败:', err));

// 清空现有数据
const clearData = async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Comment.deleteMany({});
  console.log('所有集合已清空');
};

// 创建示例用户
const createUsers = async () => {
  console.log('开始创建用户...');
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const users = [
    {
      username: 'creative_mind',
      email: 'creative@example.com',
      password: hashedPassword,
      profile: {
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        bio: '热爱创意设计和艺术的自由职业者',
        interests: ['设计', '插画', '摄影']
      }
    },
    {
      username: 'tech_innovator',
      email: 'tech@example.com',
      password: hashedPassword,
      profile: {
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        bio: '技术极客，喜欢将创意变为现实',
        interests: ['编程', '人工智能', 'IoT']
      }
    },
    {
      username: 'story_teller',
      email: 'story@example.com',
      password: hashedPassword,
      profile: {
        avatar: 'https://randomuser.me/api/portraits/women/34.jpg',
        bio: '讲故事的人，专注于内容创作和叙事',
        interests: ['写作', '电影', '剧本']
      }
    }
  ];
  
  return await User.insertMany(users);
};

// 创建示例项目
const createProjects = async (users) => {
  console.log('开始创建项目...');
  
  const projects = [
    {
      title: '未来城市 - 概念设计项目',
      description: '这是一个关于未来城市的概念设计项目，包含建筑、交通和可持续发展的新理念。我们旨在创建一个环保、高效且宜居的城市模型。',
      creator: users[0]._id,
      collaborators: [users[1]._id],
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
          caption: '未来城市概念图1'
        },
        {
          type: 'document',
          url: '/uploads/media/future_city_plan.pdf',
          caption: '详细规划文档'
        }
      ],
      status: 'in-progress',
      tags: ['设计', '建筑', '未来', '可持续发展']
    },
    {
      title: 'AR互动体验应用',
      description: '基于增强现实技术的互动体验应用，用户可以通过手机扫描特定物体，获得丰富的交互内容和信息。',
      creator: users[1]._id,
      collaborators: [users[0]._id, users[2]._id],
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620',
          caption: 'AR应用界面设计'
        },
        {
          type: 'video',
          url: '/uploads/media/ar_demo.mp4',
          caption: '概念演示视频'
        }
      ],
      status: 'draft',
      tags: ['AR', '应用开发', '交互设计', '技术']
    },
    {
      title: '短篇故事集 - 城市之声',
      description: '这是一部关于城市生活的短篇故事集，通过不同人物的视角展现现代都市生活的喜怒哀乐。',
      creator: users[2]._id,
      collaborators: [],
      media: [
        {
          type: 'document',
          url: '/uploads/media/story_excerpt.pdf',
          caption: '故事摘录'
        },
        {
          type: 'audio',
          url: '/uploads/media/city_sounds.mp3',
          caption: '城市声音采集'
        }
      ],
      status: 'completed',
      tags: ['文学', '故事', '城市', '叙事']
    },
    {
      title: '环保包装设计',
      description: '这个项目致力于创造创新的、环保的产品包装设计。我们希望减少塑料使用，并提高材料的可回收性。',
      creator: users[0]._id,
      collaborators: [users[2]._id],
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1541262294895-59e6527f804d',
          caption: '包装设计原型'
        }
      ],
      status: 'in-progress',
      tags: ['设计', '环保', '包装', '可持续发展']
    }
  ];
  
  return await Project.insertMany(projects);
};

// 创建示例评论
const createComments = async (users, projects) => {
  console.log('开始创建评论...');
  
  const comments = [
    {
      content: '这个设计非常创新，我特别喜欢你对可持续材料的运用。',
      author: users[1]._id,
      project: projects[0]._id
    },
    {
      content: '交通系统的设计有些问题，我们可以讨论一下如何优化？',
      author: users[2]._id,
      project: projects[0]._id
    },
    {
      content: 'AR技术的应用场景可以更广泛，建议增加教育领域的案例。',
      author: users[0]._id,
      project: projects[1]._id
    },
    {
      content: '界面设计很直观，但动效可以更自然一些。',
      author: users[2]._id,
      project: projects[1]._id
    },
    {
      content: '第三章的叙事节奏感特别好，给人很沉浸的感觉。',
      author: users[0]._id,
      project: projects[2]._id
    },
    {
      content: '主角的心理描写可以再深入一些。',
      author: users[1]._id,
      project: projects[2]._id
    },
    {
      content: '这种材料的成本控制是个挑战，有没有考虑过替代方案？',
      author: users[2]._id,
      project: projects[3]._id
    },
    {
      content: '颜色选择非常吸引人，与品牌调性很匹配。',
      author: users[1]._id,
      project: projects[3]._id
    }
  ];
  
  return await Comment.insertMany(comments);
};

// 执行种子数据填充
const seedDatabase = async () => {
  try {
    // 确保必要的目录存在
    ensureDirectoriesExist();
    
    await clearData();
    
    // 创建用户并获取用户ID
    const users = await createUsers();
    console.log(`已创建 ${users.length} 位用户`);
    
    // 使用用户ID创建项目
    const projects = await createProjects(users);
    console.log(`已创建 ${projects.length} 个项目`);
    
    // 使用用户ID和项目ID创建评论
    const comments = await createComments(users, projects);
    console.log(`已创建 ${comments.length} 条评论`);
    
    console.log('数据库填充完成！');
    mongoose.connection.close();
  } catch (error) {
    console.error('数据库填充失败:', error);
    mongoose.connection.close();
  }
};

// 运行填充脚本
seedDatabase(); 