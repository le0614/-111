const express = require('express');
const mongoose = require('mongoose');
const ChatSession = require('./models/ChatSession');
const ChatMessage = require('./models/ChatMessage');

// 连接数据库
mongoose.connect("mongodb+srv://gravelshaper5693:kRM7Fykyq4hdF6HJ@cluster0.s3zanjo.mongodb.net/Tuandui");

// 创建Express应用
const app = express();
app.use(express.json());

// 直接复制conversations路由逻辑
app.get('/test-conversations', async (req, res) => {
  try {
    console.log('🔍 直接测试conversations路由逻辑...\n');
    
    const sessions = await ChatSession.find({ is_active: true })
      .sort({ is_pinned: -1, pinned_at: -1, updated_at: -1 })
      .select('-__v');
    
    console.log(`找到 ${sessions.length} 个会话`);
    sessions.forEach((session, index) => {
      console.log(`会话 ${index + 1}:`);
      console.log(`  - _id: ${session._id}`);
      console.log(`  - title: ${session.title}`);
      console.log(`  - is_pinned: ${session.is_pinned} (类型: ${typeof session.is_pinned})`);
      console.log(`  - pinned_at: ${session.pinned_at} (类型: ${typeof session.pinned_at})`);
    });
    
    const conversations = await Promise.all(sessions.map(async (session) => {
      // 获取最后一条消息作为预览
      const lastMessage = await ChatMessage.findOne({ 
        session_id: session._id,
        is_deleted: false 
      }).sort({ timestamp: -1 });
      
      const conversation = {
        id: session._id,
        title: session.title,
        message_count: session.message_count,
        created_at: session.created_at,
        updated_at: session.updated_at,
        is_pinned: session.is_pinned,
        pinned_at: session.pinned_at,
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
      
      console.log(`\n处理后的conversation对象:`);
      console.log(`  - id: ${conversation.id}`);
      console.log(`  - title: ${conversation.title}`);
      console.log(`  - is_pinned: ${conversation.is_pinned} (类型: ${typeof conversation.is_pinned})`);
      console.log(`  - pinned_at: ${conversation.pinned_at} (类型: ${typeof conversation.pinned_at})`);
      
      return conversation;
    }));
    
    console.log('\n最终返回的数据:');
    console.log(JSON.stringify(conversations, null, 2));
    
    res.json(conversations);
  } catch (error) {
    console.error('❌ 路由测试失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 启动测试服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`测试服务器运行在端口 ${PORT}`);
  console.log('请访问 http://localhost:3001/test-conversations 来测试');
});

// 5秒后自动关闭
setTimeout(async () => {
  console.log('\n🔄 5秒后自动关闭测试服务器...');
  await mongoose.disconnect();
  process.exit(0);
}, 5000); 