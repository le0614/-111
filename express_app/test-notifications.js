const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/notifications';

// 测试函数
async function testNotificationsAPI() {
  console.log('=== 通知API测试开始 ===\n');

  try {
    // 1. 健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ 健康检查成功:', healthResponse.data);
    console.log('');

    // 2. 获取轮播通知
    console.log('2. 测试获取轮播通知...');
    const carouselResponse = await axios.get(`${API_BASE_URL}/carousel`);
    console.log('✅ 轮播通知获取成功:');
    console.log(`   数量: ${carouselResponse.data.count}`);
    carouselResponse.data.data.forEach((notification, index) => {
      console.log(`   ${index + 1}. [${notification.type}] ${notification.content}`);
    });
    console.log('');

    // 3. 获取所有通知
    console.log('3. 测试获取所有通知...');
    const allResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ 所有通知获取成功:');
    console.log(`   数量: ${allResponse.data.count}`);
    console.log('');

    // 4. 创建新通知
    console.log('4. 测试创建新通知...');
    const newNotification = {
      content: "测试通知：这是一个测试通知",
      type: "info",
      priority: 2,
      display_duration: 3000,
      target_audience: "all"
    };
    const createResponse = await axios.post(`${API_BASE_URL}/`, newNotification);
    console.log('✅ 通知创建成功:', createResponse.data.message);
    const createdId = createResponse.data.data._id;
    console.log('');

    // 5. 获取单个通知
    console.log('5. 测试获取单个通知...');
    const singleResponse = await axios.get(`${API_BASE_URL}/${createdId}`);
    console.log('✅ 单个通知获取成功:', singleResponse.data.data.content);
    console.log('');

    // 6. 更新通知
    console.log('6. 测试更新通知...');
    const updateData = {
      content: "测试通知：已更新的通知内容",
      priority: 3
    };
    const updateResponse = await axios.put(`${API_BASE_URL}/${createdId}`, updateData);
    console.log('✅ 通知更新成功:', updateResponse.data.message);
    console.log('');

    // 7. 测试批量操作
    console.log('7. 测试批量操作...');
    const batchData = {
      action: 'deactivate',
      ids: [createdId]
    };
    const batchResponse = await axios.post(`${API_BASE_URL}/batch`, batchData);
    console.log('✅ 批量操作成功:', batchResponse.data.message);
    console.log('');

    // 8. 重新激活通知
    console.log('8. 重新激活通知...');
    const reactivateData = {
      action: 'activate',
      ids: [createdId]
    };
    const reactivateResponse = await axios.post(`${API_BASE_URL}/batch`, reactivateData);
    console.log('✅ 重新激活成功:', reactivateResponse.data.message);
    console.log('');

    // 9. 删除通知
    console.log('9. 测试删除通知...');
    const deleteResponse = await axios.delete(`${API_BASE_URL}/${createdId}`);
    console.log('✅ 通知删除成功:', deleteResponse.data.message);
    console.log('');

    console.log('=== 所有测试通过 ===');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testNotificationsAPI(); 