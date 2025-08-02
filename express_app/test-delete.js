const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testDeleteFunction() {
  console.log('🗑️ 测试删除功能...\n');

  try {
    // 1. 创建测试会话
    console.log('1. 创建测试会话...');
    const sessionResponse = await axios.post(`${API_BASE_URL}/sessions`, {
      title: '测试删除会话'
    });
    const sessionId = sessionResponse.data.id;
    console.log('✅ 创建会话成功:', sessionId);

    // 2. 发送一些测试消息
    console.log('\n2. 发送测试消息...');
    await axios.post(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
      type: 'user',
      content: '这是要删除的测试消息1'
    });
    await axios.post(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
      type: 'ai',
      content: '这是要删除的测试消息2'
    });
    console.log('✅ 发送测试消息成功');

    // 3. 验证会话存在
    console.log('\n3. 验证会话存在...');
    const sessionsBefore = await axios.get(`${API_BASE_URL}/sessions`);
    const sessionExists = sessionsBefore.data.find(s => s.id === sessionId);
    console.log('✅ 会话存在:', !!sessionExists);

    // 4. 删除会话
    console.log('\n4. 删除会话...');
    await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`);
    console.log('✅ 删除会话成功');

    // 5. 验证会话已被删除
    console.log('\n5. 验证会话已被删除...');
    const sessionsAfter = await axios.get(`${API_BASE_URL}/sessions`);
    const sessionStillExists = sessionsAfter.data.find(s => s.id === sessionId);
    console.log('✅ 会话已被删除:', !sessionStillExists);

    // 6. 尝试获取已删除会话的消息（应该返回404）
    console.log('\n6. 尝试获取已删除会话的消息...');
    try {
      await axios.get(`${API_BASE_URL}/sessions/${sessionId}/messages`);
      console.log('❌ 错误：应该返回404');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ 正确返回404，会话已被删除');
      } else {
        console.log('❌ 意外的错误:', error.message);
      }
    }

    console.log('\n🎉 删除功能测试完成！');

  } catch (error) {
    console.log('\n❌ 测试失败:', error.message);
    if (error.response) {
      console.log('错误详情:', error.response.data);
      console.log('状态码:', error.response.status);
    }
  }
}

// 运行测试
testDeleteFunction(); 