const mongoose = require('mongoose');
const axios = require('axios');

console.log('🔍 开始诊断聊天功能问题...\n');

async function diagnoseChatIssues() {
  // 1. 检查数据库连接
  console.log('1. 检查数据库连接...');
  try {
    await mongoose.connect("mongodb+srv://gravelshaper5693:kRM7Fykyq4hdF6HJ@cluster0.s3zanjo.mongodb.net/Tuandui");
    console.log('✅ 数据库连接成功');
    
    // 检查集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const chatCollections = collections.filter(col => 
      col.name.includes('chatsessions') || col.name.includes('chatmessages')
    );
    console.log('📊 聊天相关集合:', chatCollections.map(col => col.name));
    
  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message);
    return;
  }

  // 2. 检查数据模型
  console.log('\n2. 检查数据模型...');
  try {
    const ChatSession = require('./models/ChatSession');
    const ChatMessage = require('./models/ChatMessage');
    console.log('✅ 数据模型加载成功');
    
    // 检查现有数据
    const sessionCount = await ChatSession.countDocuments();
    const messageCount = await ChatMessage.countDocuments();
    console.log(`📊 现有会话数量: ${sessionCount}`);
    console.log(`📊 现有消息数量: ${messageCount}`);
    
  } catch (error) {
    console.log('❌ 数据模型加载失败:', error.message);
  }

  // 3. 检查服务器状态
  console.log('\n3. 检查服务器状态...');
  try {
    const response = await axios.get('http://localhost:3000/api/health', {
      timeout: 5000
    });
    console.log('✅ 服务器运行正常');
    console.log('📊 服务器响应:', response.data);
  } catch (error) {
    console.log('❌ 服务器连接失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 提示: 请启动后端服务器: npm start');
    }
  }

  // 4. 测试API端点
  console.log('\n4. 测试API端点...');
  try {
    // 测试创建会话
    const sessionResponse = await axios.post('http://localhost:3000/api/sessions', {
      title: '诊断测试会话'
    });
    console.log('✅ 创建会话成功:', sessionResponse.data.id);
    
    const sessionId = sessionResponse.data.id;
    
    // 测试发送消息
    const messageResponse = await axios.post(`http://localhost:3000/api/sessions/${sessionId}/messages`, {
      type: 'user',
      content: '诊断测试消息'
    });
    console.log('✅ 发送消息成功:', messageResponse.data.id);
    
    // 测试获取消息
    const messagesResponse = await axios.get(`http://localhost:3000/api/sessions/${sessionId}/messages`);
    console.log('✅ 获取消息成功，数量:', messagesResponse.data.length);
    
  } catch (error) {
    console.log('❌ API测试失败:', error.message);
    if (error.response) {
      console.log('📊 错误详情:', error.response.data);
      console.log('📊 状态码:', error.response.status);
    }
  }

  // 5. 检查前端配置
  console.log('\n5. 检查前端配置...');
  console.log('📊 API基础URL: http://localhost:3000/api');
  console.log('📊 前端应该连接到: http://localhost:3000/api');
  
  // 6. 常见问题检查
  console.log('\n6. 常见问题检查...');
  console.log('📋 检查清单:');
  console.log('   - 后端服务器是否启动 (npm start)');
  console.log('   - 数据库连接是否正常');
  console.log('   - 端口3000是否被占用');
  console.log('   - 前端API配置是否正确');
  console.log('   - 网络连接是否正常');
  console.log('   - CORS配置是否正确');

  console.log('\n🎯 诊断完成！');
}

// 运行诊断
diagnoseChatIssues().catch(console.error); 