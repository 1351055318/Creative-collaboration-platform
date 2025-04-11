const fs = require('fs');
const path = require('path');

// 需要创建的目录列表
const directories = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../uploads/avatars'),
  path.join(__dirname, '../uploads/media')
];

// 创建目录的函数
const createDirectories = () => {
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`已创建目录: ${dir}`);
    } else {
      console.log(`目录已存在: ${dir}`);
    }
  });
};

// 执行创建操作
createDirectories(); 