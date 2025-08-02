const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

async function testChatAPI() {
  console.log('开始测试聊天API...\n');

  try {
    // 1. 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await apiClient.get('/health');
    console.log('健康检查结果:', healthResponse.data);
    console.log('✅ 健康检查通过\n');

    // 2. 创建新会话
    console.log('2. 创建新会话...');
    const createSessionResponse = await apiClient.post('/sessions', {
      title: '测试会话'
    });
    const sessionId = createSessionResponse.data.id;
    console.log('创建会话结果:', createSessionResponse.data);
    console.log('✅ 会话创建成功\n');

    // 3. 发送用户消息
    console.log('3. 发送用户消息...');
    const userMessageResponse = await apiClient.post(`/sessions/${sessionId}/messages`, {
      type: 'user',
      content: '你好，这是一个测试消息'
    });
    console.log('用户消息发送结果:', userMessageResponse.data);
    console.log('✅ 用户消息发送成功\n');

    // 4. 发送AI回复
    console.log('4. 发送AI回复...');
    const aiMessageResponse = await apiClient.post(`/sessions/${sessionId}/messages`, {
      type: 'ai',
      content: '你好！我是AI助手，很高兴为您服务。'
    });
    console.log('AI消息发送结果:', aiMessageResponse.data);
    console.log('✅ AI消息发送成功\n');

    // 5. 获取会话消息
    console.log('5. 获取会话消息...');
    const messagesResponse = await apiClient.get(`/sessions/${sessionId}/messages`);
    console.log('获取消息结果:', messagesResponse.data);
    console.log('✅ 消息获取成功\n');

    // 6. 获取会话列表
    console.log('6. 获取会话列表...');
    const sessionsResponse = await apiClient.get('/sessions');
    console.log('会话列表结果:', sessionsResponse.data);
    console.log('✅ 会话列表获取成功\n');

    // 7. 获取对话列表
    console.log('7. 获取对话列表...');
    const conversationsResponse = await apiClient.get('/conversations');
    console.log('对话列表结果:', conversationsResponse.data);
    console.log('✅ 对话列表获取成功\n');

    // 8. 搜索消息
    console.log('8. 搜索消息...');
    const searchResponse = await apiClient.get('/search', {
      params: { q: '测试' }
    });
    console.log('搜索结果:', searchResponse.data);
    console.log('✅ 搜索功能正常\n');

    // 9. 更新会话标题
    console.log('9. 更新会话标题...');
    const updateResponse = await apiClient.put(`/sessions/${sessionId}`, {
      title: '更新后的测试会话'
    });
    console.log('更新结果:', updateResponse.data);
    console.log('✅ 标题更新成功\n');

    // 10. 删除会话
    console.log('10. 删除会话...');
    await apiClient.delete(`/sessions/${sessionId}`);
    console.log('✅ 会话删除成功\n');

    console.log('🎉 所有API测试通过！');

  } catch (error) {
    console.error('❌ API测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testChatAPI(); 