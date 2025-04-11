const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const createUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    // 根据文件类型确定存储路径
    if (file.fieldname === 'avatar') {
      uploadPath = path.join(__dirname, '../uploads/avatars');
    } else {
      uploadPath = path.join(__dirname, '../uploads/media');
    }
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|mp3|wav|pdf|doc|docx|xls|xlsx|ppt|pptx/;
  
  // 检查文件扩展名
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // 检查MIME类型
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('不支持的文件类型！只允许图片、视频、音频和文档文件。'));
  }
};

// 配置上传
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制上传文件大小为10MB
});

// 上传头像 - 认证中间件已在index.js中全局添加
router.post('/avatar', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }
    
    // 返回文件URL
    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    
    res.json({
      message: '头像上传成功',
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ message: '头像上传失败', error: error.message });
  }
});

// 上传项目媒体 - 认证中间件已在index.js中全局添加
router.post('/media', upload.single('media'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }
    
    // 获取文件类型
    let fileType;
    if (req.file.mimetype.includes('image')) {
      fileType = 'image';
    } else if (req.file.mimetype.includes('video')) {
      fileType = 'video';
    } else if (req.file.mimetype.includes('audio')) {
      fileType = 'audio';
    } else {
      fileType = 'document';
    }
    
    // 返回文件信息
    const fileInfo = {
      url: `/uploads/media/${req.file.filename}`,
      type: fileType,
      originalName: req.file.originalname,
      size: req.file.size
    };
    
    res.json({
      message: '媒体上传成功',
      file: fileInfo
    });
  } catch (error) {
    res.status(500).json({ message: '媒体上传失败', error: error.message });
  }
});

module.exports = router; 