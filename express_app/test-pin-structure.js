const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testPinStructure() {
  try {
    console.log('🔍 测试对话列表数据结构...\n');

    // 1. 获取对话列表
    console.log('1. 获取对话列表...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/conversations`);
    const conversations = conversationsResponse.data;
    
    console.log(`   找到 ${conversations.length} 个对话`);
    
    // 2. 检查每个对话的数据结构
    console.log('\n2. 检查对话数据结构:');
    conversations.forEach((conversation, index) => {
      console.log(`\n   对话 ${index + 1}:`);
      console.log(`   - ID: ${conversation.id}`);
      console.log(`   - 标题: ${conversation.title}`);
      console.log(`   - is_pinned: ${conversation.is_pinned} (类型: ${typeof conversation.is_pinned})`);
      console.log(`   - pinned_at: ${conversation.pinned_at} (类型: ${typeof conversation.pinned_at})`);
      console.log(`   - updated_at: ${conversation.updated_at}`);
      console.log(`   - 消息数量: ${conversation.message_count}`);
    });

    // 3. 检查排序是否正确
    console.log('\n3. 检查排序顺序:');
    const pinnedConversations = conversations.filter(c => c.is_pinned);
    const unpinnedConversations = conversations.filter(c => !c.is_pinned);
    
    console.log(`   置顶对话: ${pinnedConversations.length} 个`);
    pinnedConversations.forEach((conv, index) => {
      console.log(`   ${index + 1}. ${conv.title} (置顶时间: ${conv.pinned_at})`);
    });
    
    console.log(`\n   非置顶对话: ${unpinnedConversations.length} 个`);
    unpinnedConversations.forEach((conv, index) => {
      console.log(`   ${index + 1}. ${conv.title} (更新时间: ${conv.updated_at})`);
    });

    // 4. 测试置顶功能
    if (conversations.length > 0) {
      console.log('\n4. 测试置顶功能...');
      const firstConversation = conversations[0];
      const currentPinState = firstConversation.is_pinned;
      const newPinState = !currentPinState;
      
      console.log(`   测试对话: ${firstConversation.title}`);
      console.log(`   当前置顶状态: ${currentPinState}`);
      console.log(`   新置顶状态: ${newPinState}`);
      
      try {
        await axios.patch(`${API_BASE_URL}/sessions/${firstConversation.id}/pin`, {
          is_pinned: newPinState
        });
        console.log('   ✅ 置顶状态更新成功');
        
        // 重新获取对话列表验证
        const updatedResponse = await axios.get(`${API_BASE_URL}/conversations`);
        const updatedConversations = updatedResponse.data;
        const updatedConversation = updatedConversations.find(c => c.id === firstConversation.id);
        
        if (updatedConversation) {
          console.log(`   验证结果: is_pinned = ${updatedConversation.is_pinned}`);
          console.log(`   验证结果: pinned_at = ${updatedConversation.pinned_at}`);
          
          if (updatedConversation.is_pinned === newPinState) {
            console.log('   ✅ 置顶状态验证成功');
          } else {
            console.log('   ❌ 置顶状态验证失败');
          }
        }
        
        // 恢复原状态
        await axios.patch(`${API_BASE_URL}/sessions/${firstConversation.id}/pin`, {
          is_pinned: currentPinState
        });
        console.log('   🔄 已恢复原置顶状态');
        
      } catch (error) {
        console.error('   ❌ 置顶测试失败:', error.response?.data || error.message);
      }
    }

    console.log('\n✅ 测试完成');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testPinStructure(); 