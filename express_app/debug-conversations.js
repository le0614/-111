const mongoose = require('mongoose');
const ChatSession = require('./models/ChatSession');
const ChatMessage = require('./models/ChatMessage');

// 连接数据库
mongoose.connect("mongodb+srv://gravelshaper5693:kRM7Fykyq4hdF6HJ@cluster0.s3zanjo.mongodb.net/Tuandui");

async function debugConversations() {
  try {
    console.log('🔍 调试conversations API...\n');

    // 1. 直接查询数据库
    console.log('1. 直接查询数据库中的会话:');
    const sessions = await ChatSession.find({ is_active: true })
      .sort({ is_pinned: -1, pinned_at: -1, updated_at: -1 })
      .select('-__v');
    
    console.log(`   找到 ${sessions.length} 个会话`);
    sessions.forEach((session, index) => {
      console.log(`\n   会话 ${index + 1}:`);
      console.log(`   - _id: ${session._id}`);
      console.log(`   - title: ${session.title}`);
      console.log(`   - is_pinned: ${session.is_pinned} (类型: ${typeof session.is_pinned})`);
      console.log(`   - pinned_at: ${session.pinned_at} (类型: ${typeof session.pinned_at})`);
      console.log(`   - 原始对象:`, session.toObject());
    });

    // 2. 模拟API处理逻辑
    console.log('\n2. 模拟API处理逻辑:');
    const conversations = await Promise.all(sessions.map(async (session) => {
      console.log(`\n   处理会话 ${session._id}:`);
      console.log(`   - session.is_pinned: ${session.is_pinned}`);
      console.log(`   - session.pinned_at: ${session.pinned_at}`);
      
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
      
      console.log(`   - conversation.is_pinned: ${conversation.is_pinned}`);
      console.log(`   - conversation.pinned_at: ${conversation.pinned_at}`);
      
      return conversation;
    }));

    // 3. 检查最终结果
    console.log('\n3. 最终API返回结果:');
    conversations.forEach((conversation, index) => {
      console.log(`\n   对话 ${index + 1}:`);
      console.log(`   - id: ${conversation.id}`);
      console.log(`   - title: ${conversation.title}`);
      console.log(`   - is_pinned: ${conversation.is_pinned} (类型: ${typeof conversation.is_pinned})`);
      console.log(`   - pinned_at: ${conversation.pinned_at} (类型: ${typeof conversation.pinned_at})`);
    });

    // 4. 测试置顶功能
    if (sessions.length > 0) {
      console.log('\n4. 测试置顶功能:');
      const testSession = sessions[0];
      console.log(`   测试会话: ${testSession.title} (ID: ${testSession._id})`);
      console.log(`   当前置顶状态: ${testSession.is_pinned}`);
      
      // 更新置顶状态
      const updateData = {
        is_pinned: true,
        pinned_at: new Date(),
        updated_at: new Date()
      };
      
      const updatedSession = await ChatSession.findByIdAndUpdate(
        testSession._id, 
        updateData, 
        { new: true }
      );
      
      console.log(`   更新后置顶状态: ${updatedSession.is_pinned}`);
      console.log(`   更新后置顶时间: ${updatedSession.pinned_at}`);
      
      // 恢复原状态
      await ChatSession.findByIdAndUpdate(testSession._id, {
        is_pinned: false,
        pinned_at: null,
        updated_at: new Date()
      });
      console.log('   🔄 已恢复原状态');
    }

    console.log('\n✅ 调试完成');

  } catch (error) {
    console.error('❌ 调试失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugConversations(); 