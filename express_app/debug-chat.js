const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testChatAPI() {
  console.log('🔍 开始测试聊天API...\n');

  try {
    // 1. 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ 健康检查成功:', healthResponse.data);
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 提示: 后端服务器可能没有启动，请运行: npm start');
      return;
    }
  }

  try {
    // 2. 创建新会话
    console.log('\n2. 创建新会话...');
    const sessionResponse = await axios.post(`${API_BASE_URL}/sessions`, {
      title: '测试会话'
    });
    console.log('✅ 创建会话成功:', sessionResponse.data);
    const sessionId = sessionResponse.data.id;

    // 3. 发送用户消息
    console.log('\n3. 发送用户消息...');
    const userMessageResponse = await axios.post(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
      type: 'user',
      content: '你好，这是一条测试消息'
    });
    console.log('✅ 发送用户消息成功:', userMessageResponse.data);

    // 4. 发送AI消息
    console.log('\n4. 发送AI消息...');
    const aiMessageResponse = await axios.post(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
      type: 'ai',
      content: '你好！我是AI助手，很高兴为您服务。'
    });
    console.log('✅ 发送AI消息成功:', aiMessageResponse.data);

    // 5. 获取会话消息
    console.log('\n5. 获取会话消息...');
    const messagesResponse = await axios.get(`${API_BASE_URL}/sessions/${sessionId}/messages`);
    console.log('✅ 获取消息成功，消息数量:', messagesResponse.data.length);
    console.log('消息列表:', messagesResponse.data);

    // 6. 获取会话列表
    console.log('\n6. 获取会话列表...');
    const sessionsResponse = await axios.get(`${API_BASE_URL}/sessions`);
    console.log('✅ 获取会话列表成功，会话数量:', sessionsResponse.data.length);

    // 7. 获取对话列表
    console.log('\n7. 获取对话列表...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/conversations`);
    console.log('✅ 获取对话列表成功，对话数量:', conversationsResponse.data.length);

    console.log('\n🎉 所有测试通过！聊天API工作正常。');

  } catch (error) {
    console.log('\n❌ 测试失败:', error.message);
    if (error.response) {
      console.log('错误详情:', error.response.data);
      console.log('状态码:', error.response.status);
    }
  }
}

// 运行测试
testChatAPI(); 