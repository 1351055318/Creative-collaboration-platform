const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Project = require('../models/Project');

// 获取项目的所有评论
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // 检查项目是否存在
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查用户是否有权限访问该项目
    if (project.creator.toString() !== req.user.userId && 
        !project.collaborators.some(c => c.toString() === req.user.userId)) {
      return res.status(403).json({ message: '无权访问此项目' });
    }
    
    // 获取评论
    const comments = await Comment.find({ project: projectId })
      .populate('author', 'username profile')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: '获取评论失败', error: error.message });
  }
});

// 添加评论
router.post('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }
    
    // 检查项目是否存在
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    // 检查用户是否有权限访问该项目
    if (project.creator.toString() !== req.user.userId && 
        !project.collaborators.some(c => c.toString() === req.user.userId)) {
      return res.status(403).json({ message: '无权访问此项目' });
    }
    
    // 创建评论
    const comment = new Comment({
      content,
      author: req.user.userId,
      project: projectId
    });
    
    await comment.save();
    
    // 返回包含作者信息的评论
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username profile');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: '添加评论失败', error: error.message });
  }
});

// 删除评论
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    // 检查是否是评论作者或项目创建者
    const project = await Project.findById(comment.project);
    if (comment.author.toString() !== req.user.userId && 
        project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权删除此评论' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    res.json({ message: '评论已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除评论失败', error: error.message });
  }
});

module.exports = router; 