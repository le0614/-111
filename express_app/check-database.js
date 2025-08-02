const mongoose = require('mongoose');
const ChatSession = require('./models/ChatSession');

// 连接数据库
mongoose.connect("mongodb+srv://gravelshaper5693:kRM7Fykyq4hdF6HJ@cluster0.s3zanjo.mongodb.net/Tuandui");

async function checkDatabase() {
  try {
    console.log('🔍 检查数据库中的ChatSession数据结构...\n');

    // 获取所有会话
    const sessions = await ChatSession.find({});
    console.log(`找到 ${sessions.length} 个会话记录\n`);

    sessions.forEach((session, index) => {
      console.log(`会话 ${index + 1}:`);
      console.log(`  _id: ${session._id}`);
      console.log(`  title: ${session.title}`);
      console.log(`  message_count: ${session.message_count}`);
      console.log(`  is_active: ${session.is_active}`);
      console.log(`  is_pinned: ${session.is_pinned} (类型: ${typeof session.is_pinned})`);
      console.log(`  pinned_at: ${session.pinned_at} (类型: ${typeof session.pinned_at})`);
      console.log(`  created_at: ${session.created_at}`);
      console.log(`  updated_at: ${session.updated_at}`);
      console.log(`  完整对象:`, JSON.stringify(session.toObject(), null, 2));
      console.log('');
    });

    // 检查是否有置顶的会话
    const pinnedSessions = await ChatSession.find({ is_pinned: true });
    console.log(`置顶会话数量: ${pinnedSessions.length}`);

    // 检查schema定义
    console.log('\n📋 Schema字段定义:');
    const schemaFields = Object.keys(ChatSession.schema.paths);
    schemaFields.forEach(field => {
      const path = ChatSession.schema.paths[field];
      console.log(`  ${field}: ${path.instance} (默认值: ${path.defaultValue})`);
    });

  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase(); 