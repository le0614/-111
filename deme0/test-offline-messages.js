// 测试离线消息功能
const AsyncStorage = require('@react-native-async-storage/async-storage');

// 模拟待发送消息
const testPendingMessages = [
  {
    id: '1',
    type: 'user',
    content: '测试消息1',
    timestamp: new Date(),
    sessionId: 'session1',
    retryCount: 0
  },
  {
    id: '2',
    type: 'ai',
    content: '测试回复1',
    timestamp: new Date(),
    sessionId: 'session1',
    retryCount: 0
  }
];

// 测试保存待发送消息
async function testSavePendingMessages() {
  try {
    await AsyncStorage.setItem('pendingMessages', JSON.stringify(testPendingMessages));
    console.log('✅ 保存待发送消息成功');
    
    // 测试读取
    const stored = await AsyncStorage.getItem('pendingMessages');
    const parsed = JSON.parse(stored);
    console.log('✅ 读取待发送消息成功:', parsed.length, '条');
    
    // 测试删除
    await AsyncStorage.removeItem('pendingMessages');
    console.log('✅ 删除待发送消息成功');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testSavePendingMessages(); 