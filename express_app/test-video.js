const axios = require('axios');

// 测试获取视频列表
async function testGetVideos() {
  try {
    console.log('测试获取视频列表...');
    const response = await axios.get('http://localhost:3000/list/api/videos');
    console.log('视频列表:', response.data);
  } catch (error) {
    console.error('获取视频列表失败:', error.message);
  }
}

// 测试视频流
async function testVideoStream() {
  try {
    console.log('测试视频流...');
    const response = await axios.get('http://localhost:3000/list/api/video/test.mp4', {
      responseType: 'stream'
    });
    console.log('视频流响应状态:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
  } catch (error) {
    console.error('获取视频流失败:', error.message);
  }
}

// 运行测试
async function runTests() {
  console.log('开始测试视频API...\n');
  
  await testGetVideos();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testVideoStream();
  
  console.log('\n测试完成！');
}

runTests(); 