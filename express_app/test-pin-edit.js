const axios = require('axios');
const API_BASE_URL = 'http://localhost:3000/api';

async function testPinAndEditFeatures() {
  console.log('=== 测试置顶和编辑对话名称功能 ===\n');
  
  try {
    // 1. 创建测试会话
    console.log('1. 创建测试会话...');
    const createResponse = await axios.post(`${API_BASE_URL}/sessions`, {
      title: '测试对话'
    });
    const sessionId = createResponse.data.id;
    console.log('✅ 创建会话成功:', sessionId);
    
    // 2. 获取会话列表
    console.log('\n2. 获取会话列表...');
    const sessionsResponse = await axios.get(`${API_BASE_URL}/sessions`);
    console.log('✅ 获取会话列表成功:', sessionsResponse.data.length, '个会话');
    
    // 3. 测试置顶功能
    console.log('\n3. 测试置顶功能...');
    const pinResponse = await axios.patch(`${API_BASE_URL}/sessions/${sessionId}/pin`, {
      is_pinned: true
    });
    console.log('✅ 置顶成功:', pinResponse.data.message);
    
    // 4. 验证置顶状态
    console.log('\n4. 验证置顶状态...');
    const pinnedSessionsResponse = await axios.get(`${API_BASE_URL}/sessions`);
    const pinnedSession = pinnedSessionsResponse.data.find(s => s._id === sessionId);
    console.log('✅ 置顶状态:', pinnedSession.is_pinned ? '已置顶' : '未置顶');
    
    // 5. 测试编辑对话名称
    console.log('\n5. 测试编辑对话名称...');
    const editResponse = await axios.put(`${API_BASE_URL}/sessions/${sessionId}`, {
      title: '已编辑的测试对话'
    });
    console.log('✅ 编辑成功:', editResponse.data.message);
    
    // 6. 验证编辑结果
    console.log('\n6. 验证编辑结果...');
    const editedSessionsResponse = await axios.get(`${API_BASE_URL}/sessions`);
    const editedSession = editedSessionsResponse.data.find(s => s._id === sessionId);
    console.log('✅ 新标题:', editedSession.title);
    
    // 7. 测试取消置顶
    console.log('\n7. 测试取消置顶...');
    const unpinResponse = await axios.patch(`${API_BASE_URL}/sessions/${sessionId}/pin`, {
      is_pinned: false
    });
    console.log('✅ 取消置顶成功:', unpinResponse.data.message);
    
    // 8. 验证取消置顶状态
    console.log('\n8. 验证取消置顶状态...');
    const unpinnedSessionsResponse = await axios.get(`${API_BASE_URL}/sessions`);
    const unpinnedSession = unpinnedSessionsResponse.data.find(s => s._id === sessionId);
    console.log('✅ 置顶状态:', unpinnedSession.is_pinned ? '已置顶' : '未置顶');
    
    // 9. 测试对话列表API
    console.log('\n9. 测试对话列表API...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/conversations`);
    const conversation = conversationsResponse.data.find(c => c.id === sessionId);
    console.log('✅ 对话列表包含置顶信息:', {
      id: conversation.id,
      title: conversation.title,
      is_pinned: conversation.is_pinned,
      pinned_at: conversation.pinned_at
    });
    
    // 10. 清理测试数据
    console.log('\n10. 清理测试数据...');
    await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`);
    console.log('✅ 删除测试会话成功');
    
    console.log('\n=== 所有测试通过 ===');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testPinAndEditFeatures(); 