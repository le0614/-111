const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 导入数据模型
const ChatSession = require('../../models/ChatSession');
const ChatMessage = require('../../models/ChatMessage');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/chat');
    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制10MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: '聊天API服务正常运行'
  });
});

// 获取所有聊天会话
router.get('/sessions', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // 构建查询条件
    const query = { is_active: true };
    
    // 如果提供了userId，则按userId筛选
    if (userId) {
      query.userId = userId;
    }
    
    const sessions = await ChatSession.find(query)
      .sort({ is_pinned: -1, pinned_at: -1, updated_at: -1 })
      .select('-__v');
    
    res.json(sessions);
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({
      error: '获取会话列表失败',
      message: error.message
    });
  }
});

// 获取对话列表（包含预览信息）
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // 构建查询条件
    const query = { is_active: true };
    
    // 如果提供了userId，则按userId筛选
    if (userId) {
      query.userId = userId;
    }
    
    const sessions = await ChatSession.find(query)
      .sort({ is_pinned: -1, pinned_at: -1, updated_at: -1 })
      .select('-__v');
    
    const conversations = await Promise.all(sessions.map(async (session) => {
      // 获取最后一条消息作为预览
      const lastMessage = await ChatMessage.findOne({ 
        session_id: session._id,
        is_deleted: false 
      }).sort({ timestamp: -1 });
      
      return {
        id: session._id,
        title: session.title,
        message_count: session.message_count,
        created_at: session.created_at,
        updated_at: session.updated_at,
        is_pinned: session.is_pinned,
        pinned_at: session.pinned_at,
        userId: session.userId, // 添加userId字段
        last_message: lastMessage ? {
          content: lastMessage.content,
          type: lastMessage.type,
          timestamp: lastMessage.timestamp
        } : null,
        preview: lastMessage ? 
          (lastMessage.content.length > 50 ? 
            lastMessage.content.substring(0, 50) + '...' : 
            lastMessage.content) : 
          '暂无消息'
      };
    }));
    
    res.json(conversations);
  } catch (error) {
    console.error('获取对话列表失败:', error);
    res.status(500).json({
      error: '获取对话列表失败',
      message: error.message
    });
  }
});

// 创建新的聊天会话
router.post('/sessions', async (req, res) => {
  try {
    const { title = '新对话', userId } = req.body;
    
    const newSession = new ChatSession({
      title: title,
      userId: userId // 添加userId字段
    });
    
    const savedSession = await newSession.save();
    
    // 获取WebSocket服务器实例并通知新会话创建
    const chatSocketServer = req.app.get('chatSocketServer');
    if (chatSocketServer) {
      chatSocketServer.broadcast({
        type: 'new_session_created',
        session: {
          id: savedSession._id,
          title: savedSession.title,
          created_at: savedSession.created_at,
          updated_at: savedSession.updated_at,
          message_count: savedSession.message_count,
          userId: savedSession.userId
        },
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(201).json({
      id: savedSession._id,
      title: savedSession.title,
      created_at: savedSession.created_at,
      updated_at: savedSession.updated_at,
      message_count: savedSession.message_count,
      userId: savedSession.userId
    });
  } catch (error) {
    console.error('创建会话失败:', error);
    res.status(500).json({
      error: '创建会话失败',
      message: error.message
    });
  }
});

// 获取特定会话的消息
router.get('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // 验证会话是否存在
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        error: '会话不存在'
      });
    }
    
    const messages = await ChatMessage.find({ 
      session_id: sessionId,
      is_deleted: false 
    })
    .sort({ timestamp: 1 })
    .select('-__v -is_deleted');
    
    res.json(messages);
  } catch (error) {
    console.error('获取消息失败:', error);
    res.status(500).json({
      error: '获取消息失败',
      message: error.message
    });
  }
});

// 发送消息（支持图片上传）
router.post('/sessions/:sessionId/messages', upload.single('image'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { type, content } = req.body;
    
    // 验证会话是否存在
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        error: '会话不存在'
      });
    }
    
    // 验证消息类型
    if (!['user', 'ai'].includes(type)) {
      return res.status(400).json({
        error: '无效的消息类型'
      });
    }
    
    // 验证内容
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: '消息内容不能为空'
      });
    }
    
    // 处理图片上传
    let imageData = null;
    if (req.file) {
      imageData = {
        image_uri: `/uploads/chat/${req.file.filename}`,
        image_name: req.file.originalname,
        image_size: req.file.size
      };
    }
    
    // 创建新消息
    const newMessage = new ChatMessage({
      session_id: sessionId,
      type: type,
      content: content.trim(),
      ...imageData
    });
    
    const savedMessage = await newMessage.save();
    
    // 更新会话信息
    await ChatSession.findByIdAndUpdate(sessionId, {
      message_count: session.message_count + 1,
      last_message_time: new Date(),
      updated_at: new Date()
    });
    
    // 获取WebSocket服务器实例并通知新消息
    const chatSocketServer = req.app.get('chatSocketServer');
    if (chatSocketServer) {
      chatSocketServer.notifyNewMessage(sessionId, {
        id: savedMessage._id,
        session_id: savedMessage.session_id,
        type: savedMessage.type,
        content: savedMessage.content,
        image_uri: savedMessage.image_uri,
        image_name: savedMessage.image_name,
        image_size: savedMessage.image_size,
        timestamp: savedMessage.timestamp
      });
    }
    
    res.status(201).json({
      id: savedMessage._id,
      session_id: savedMessage.session_id,
      type: savedMessage.type,
      content: savedMessage.content,
      image_uri: savedMessage.image_uri,
      image_name: savedMessage.image_name,
      image_size: savedMessage.image_size,
      timestamp: savedMessage.timestamp
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({
      error: '发送消息失败',
      message: error.message
    });
  }
});

// 删除会话
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // 验证会话是否存在
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        error: '会话不存在'
      });
    }
    
    // 软删除会话
    await ChatSession.findByIdAndUpdate(sessionId, {
      is_active: false,
      updated_at: new Date()
    });
    
    // 获取WebSocket服务器实例并通知会话删除
    const chatSocketServer = req.app.get('chatSocketServer');
    if (chatSocketServer) {
      chatSocketServer.notifySessionDeleted(sessionId);
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('删除会话失败:', error);
    res.status(500).json({
      error: '删除会话失败',
      message: error.message
    });
  }
});

// 更新会话标题
router.put('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: '标题不能为空'
      });
    }
    
    // 验证会话是否存在
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        error: '会话不存在'
      });
    }
    
    // 更新标题
    const updatedSession = await ChatSession.findByIdAndUpdate(sessionId, {
      title: title.trim(),
      updated_at: new Date()
    }, { new: true });
    
    // 获取WebSocket服务器实例并通知会话更新
    const chatSocketServer = req.app.get('chatSocketServer');
    if (chatSocketServer) {
      chatSocketServer.notifySessionUpdate(sessionId, {
        id: updatedSession._id,
        title: updatedSession.title,
        updated_at: updatedSession.updated_at
      });
    }
    
    res.status(200).json({
      message: '标题更新成功'
    });
  } catch (error) {
    console.error('更新会话标题失败:', error);
    res.status(500).json({
      error: '更新会话标题失败',
      message: error.message
    });
  }
});

// 置顶/取消置顶会话
router.patch('/sessions/:sessionId/pin', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { is_pinned } = req.body;
    
    // 验证会话是否存在
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        error: '会话不存在'
      });
    }
    
    // 更新置顶状态
    const updateData = {
      is_pinned: is_pinned,
      updated_at: new Date()
    };
    
    if (is_pinned) {
      updateData.pinned_at = new Date();
    } else {
      updateData.pinned_at = null;
    }
    
    const updatedSession = await ChatSession.findByIdAndUpdate(sessionId, updateData, { new: true });
    
    // 获取WebSocket服务器实例并通知会话更新
    const chatSocketServer = req.app.get('chatSocketServer');
    if (chatSocketServer) {
      chatSocketServer.notifySessionUpdate(sessionId, {
        id: updatedSession._id,
        title: updatedSession.title,
        is_pinned: updatedSession.is_pinned,
        pinned_at: updatedSession.pinned_at,
        updated_at: updatedSession.updated_at
      });
    }
    
    res.status(200).json({
      message: is_pinned ? '会话已置顶' : '会话已取消置顶'
    });
  } catch (error) {
    console.error('更新置顶状态失败:', error);
    res.status(500).json({
      error: '更新置顶状态失败',
      message: error.message
    });
  }
});

// 搜索消息
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: '搜索关键词不能为空'
      });
    }
    
    const messages = await ChatMessage.find({
      content: { $regex: q.trim(), $options: 'i' },
      is_deleted: false
    })
    .populate('session_id', 'title')
    .sort({ timestamp: -1 })
    .limit(50)
    .select('-__v -is_deleted');
    
    res.json(messages);
  } catch (error) {
    console.error('搜索消息失败:', error);
    res.status(500).json({
      error: '搜索消息失败',
      message: error.message
    });
  }
});

module.exports = router; 