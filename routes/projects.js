const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// 获取所有项目
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ 
      $or: [
        { creator: req.user.userId },
        { collaborators: req.user.userId }
      ]
    })
    .populate('creator', 'username')
    .populate('collaborators', 'username')
    .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: '获取项目失败', error: error.message });
  }
});

// 创建新项目
router.post('/', async (req, res) => {
  try {
    const { title, description, status, tags } = req.body;
    const creator = req.user.userId; // 从认证中间件获取
    
    const project = new Project({
      title,
      description,
      creator,
      status: status || 'draft',
      tags: tags || []
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: '创建项目失败', error: error.message });
  }
});

// 获取单个项目
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'username profile')
      .populate('collaborators', 'username profile');
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查是否有权限访问
    if (project.creator._id.toString() !== req.user.userId && 
        !project.collaborators.some(c => c._id.toString() === req.user.userId)) {
      return res.status(403).json({ message: '无权访问此项目' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: '获取项目失败', error: error.message });
  }
});

// 更新项目
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, tags } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查是否是项目创建者
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权修改此项目' });
    }
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.status = status || project.status;
    project.tags = tags || project.tags;
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: '更新项目失败', error: error.message });
  }
});

// 删除项目
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查是否是项目创建者
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权删除此项目' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: '项目已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除项目失败', error: error.message });
  }
});

// 添加媒体文件
router.post('/:id/media', async (req, res) => {
  try {
    console.log('收到添加媒体请求:', req.body);
    const { type, url, caption } = req.body;
    
    if (!type || !url) {
      return res.status(400).json({ message: '缺少必要的媒体信息' });
    }
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查权限
    if (project.creator.toString() !== req.user.userId && 
        !project.collaborators.some(c => c.toString() === req.user.userId)) {
      return res.status(403).json({ message: '无权修改此项目' });
    }
    
    const newMedia = {
      type,
      url,
      caption: caption || ''
    };
    
    console.log('添加媒体:', newMedia);
    project.media.push(newMedia);
    await project.save();
    
    res.status(201).json(newMedia);
  } catch (error) {
    console.error('添加媒体失败:', error);
    res.status(500).json({ message: '添加媒体失败', error: error.message });
  }
});

// 删除媒体文件
router.delete('/:id/media/:mediaId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查权限
    if (project.creator.toString() !== req.user.userId && 
        !project.collaborators.some(c => c.toString() === req.user.userId)) {
      return res.status(403).json({ message: '无权修改此项目' });
    }
    
    // 找到要删除的媒体
    const mediaIndex = project.media.findIndex(m => m._id.toString() === req.params.mediaId);
    if (mediaIndex === -1) {
      return res.status(404).json({ message: '媒体文件不存在' });
    }
    
    // 删除媒体
    project.media.splice(mediaIndex, 1);
    await project.save();
    
    res.json({ message: '媒体文件已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除媒体失败', error: error.message });
  }
});

// 添加协作者
router.post('/:id/collaborators', async (req, res) => {
  try {
    const { email } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查是否是项目创建者
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: '只有项目创建者可以添加协作者' });
    }
    
    // 查找要添加的用户
    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res.status(404).json({ message: '找不到该用户' });
    }
    
    // 检查用户是否已经是协作者
    if (project.collaborators.includes(collaborator._id)) {
      return res.status(400).json({ message: '该用户已是项目协作者' });
    }
    
    // 检查是否是创建者自己
    if (project.creator.toString() === collaborator._id.toString()) {
      return res.status(400).json({ message: '创建者不能添加自己为协作者' });
    }
    
    // 添加协作者
    project.collaborators.push(collaborator._id);
    await project.save();
    
    res.status(201).json({
      message: '协作者添加成功',
      collaborator: {
        id: collaborator._id,
        username: collaborator.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: '添加协作者失败', error: error.message });
  }
});

// 移除协作者
router.delete('/:id/collaborators/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查是否是项目创建者
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: '只有项目创建者可以移除协作者' });
    }
    
    // 检查协作者是否存在
    const collaboratorIndex = project.collaborators.findIndex(
      c => c.toString() === req.params.userId
    );
    
    if (collaboratorIndex === -1) {
      return res.status(404).json({ message: '该用户不是项目协作者' });
    }
    
    // 移除协作者
    project.collaborators.splice(collaboratorIndex, 1);
    await project.save();
    
    res.json({ message: '协作者已移除' });
  } catch (error) {
    res.status(500).json({ message: '移除协作者失败', error: error.message });
  }
});

module.exports = router; 