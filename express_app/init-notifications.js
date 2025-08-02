const mongoose = require('mongoose');
const Notification = require('./models/Notification');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '数据库连接错误:'));
db.once('open', async () => {
  console.log('数据库连接成功');
  
  try {
    // 清空现有通知数据
    await Notification.deleteMany({});
    console.log('已清空现有通知数据');
    
    // 创建初始通知数据
    const initialNotifications = [
      {
        content: "现可以正常使用! 如遇程序问题,请加",
        type: "info",
        priority: 3,
        display_duration: 3000,
        target_audience: "all"
      },
      {
        content: "欢迎使用AI助手，为您提供智能问答服务",
        type: "success",
        priority: 2,
        display_duration: 3000,
        target_audience: "all"
      },
      {
        content: "支持文字和图片输入，让交流更便捷",
        type: "info",
        priority: 2,
        display_duration: 3000,
        target_audience: "all"
      },
      {
        content: "点击建议问题快速开始对话",
        type: "info",
        priority: 1,
        display_duration: 3000,
        target_audience: "new_users"
      },
      {
        content: "新功能上线：图片识别与分析",
        type: "success",
        priority: 3,
        display_duration: 4000,
        target_audience: "all"
      },
      {
        content: "系统维护通知：今晚22:00-24:00进行系统升级",
        type: "warning",
        priority: 3,
        display_duration: 5000,
        target_audience: "all",
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后过期
      },
      {
        content: "VIP用户专享：无限次AI对话，立即升级",
        type: "info",
        priority: 2,
        display_duration: 3500,
        target_audience: "all"
      },
      {
        content: "新用户福利：首次对话免费体验",
        type: "success",
        priority: 2,
        display_duration: 3000,
        target_audience: "new_users"
      }
    ];
    
    // 插入通知数据
    const result = await Notification.insertMany(initialNotifications);
    console.log(`成功创建 ${result.length} 条通知数据`);
    
    // 显示创建的通知
    console.log('\n创建的通知列表:');
    result.forEach((notification, index) => {
      console.log(`${index + 1}. [${notification.type.toUpperCase()}] ${notification.content}`);
    });
    
    // 测试获取轮播通知
    console.log('\n测试获取轮播通知:');
    const carouselNotifications = await Notification.getCarouselNotifications();
    console.log(`轮播通知数量: ${carouselNotifications.length}`);
    
    // 测试获取活跃通知
    console.log('\n测试获取活跃通知:');
    const activeNotifications = await Notification.getActiveNotifications();
    console.log(`活跃通知数量: ${activeNotifications.length}`);
    
  } catch (error) {
    console.error('初始化通知数据失败:', error);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
    console.log('数据库连接已关闭');
  }
}); 