const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER_ID = '688b175c37a0af670aded702';

async function testUserFiltering() {
  console.log('🧪 测试用户筛选功能...\n');

  try {
    // 1. 测试获取所有会话（不筛选）
    console.log('1️⃣ 测试获取所有会话（不筛选userId）:');
    const allSessionsResponse = await axios.get(`${API_BASE_URL}/sessions`);
    console.log(`   返回 ${allSessionsResponse.data.length} 个会话`);
    console.log('   前3个会话的userId:', allSessionsResponse.data.slice(0, 3).map(s => s.userId));
    console.log('');

    // 2. 测试按userId筛选会话
    console.log('2️⃣ 测试按userId筛选会话:');
    const filteredSessionsResponse = await axios.get(`${API_BASE_URL}/sessions?userId=${TEST_USER_ID}`);
    console.log(`   返回 ${filteredSessionsResponse.data.length} 个会话`);
    console.log('   所有会话的userId:', filteredSessionsResponse.data.map(s => s.userId));
    console.log('');

    // 3. 测试获取所有对话（不筛选）
    console.log('3️⃣ 测试获取所有对话（不筛选userId）:');
    const allConversationsResponse = await axios.get(`${API_BASE_URL}/conversations`);
    console.log(`   返回 ${allConversationsResponse.data.length} 个对话`);
    console.log('   前3个对话的userId:', allConversationsResponse.data.slice(0, 3).map(c => c.userId));
    console.log('');

    // 4. 测试按userId筛选对话
    console.log('4️⃣ 测试按userId筛选对话:');
    const filteredConversationsResponse = await axios.get(`${API_BASE_URL}/conversations?userId=${TEST_USER_ID}`);
    console.log(`   返回 ${filteredConversationsResponse.data.length} 个对话`);
    console.log('   所有对话的userId:', filteredConversationsResponse.data.map(c => c.userId));
    console.log('');

    // 5. 测试创建新会话时包含userId
    console.log('5️⃣ 测试创建新会话时包含userId:');
    const createSessionResponse = await axios.post(`${API_BASE_URL}/sessions`, {
      title: '测试用户筛选会话',
      userId: TEST_USER_ID
    });
    console.log('   创建成功，会话ID:', createSessionResponse.data.id);
    console.log('   会话userId:', createSessionResponse.data.userId);
    console.log('');

    // 6. 验证新创建的会话是否在筛选结果中
    console.log('6️⃣ 验证新创建的会话是否在筛选结果中:');
    const verifyResponse = await axios.get(`${API_BASE_URL}/sessions?userId=${TEST_USER_ID}`);
    const newSession = verifyResponse.data.find(s => s.id === createSessionResponse.data.id);
    if (newSession) {
      console.log('   ✅ 新会话在筛选结果中找到');
      console.log('   会话标题:', newSession.title);
      console.log('   会话userId:', newSession.userId);
    } else {
      console.log('   ❌ 新会话未在筛选结果中找到');
    }

    console.log('\n🎉 用户筛选功能测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testUserFiltering(); 