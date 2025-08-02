const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1, // 1-低优先级, 2-中优先级, 3-高优先级
    min: 1,
    max: 3
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    default: null // null表示永不过期
  },
  display_duration: {
    type: Number,
    default: 3000 // 显示时长（毫秒）
  },
  target_audience: {
    type: String,
    enum: ['all', 'new_users', 'vip_users'],
    default: 'all'
  }
}, {
  timestamps: true
});

// 添加虚拟字段：是否过期
notificationSchema.virtual('is_expired').get(function() {
  if (!this.end_date) return false;
  return new Date() > this.end_date;
});

// 添加虚拟字段：是否应该显示
notificationSchema.virtual('should_display').get(function() {
  return this.is_active && !this.is_expired;
});

// 确保虚拟字段在JSON序列化时包含
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

// 静态方法：获取活跃的通知
notificationSchema.statics.getActiveNotifications = function() {
  return this.find({
    is_active: true,
    $or: [
      { end_date: null },
      { end_date: { $gt: new Date() } }
    ]
  }).sort({ priority: -1, created_at: -1 });
};

// 静态方法：获取轮播通知
notificationSchema.statics.getCarouselNotifications = function() {
  return this.find({
    is_active: true,
    $or: [
      { end_date: null },
      { end_date: { $gt: new Date() } }
    ]
  }).sort({ priority: -1, created_at: -1 }).limit(10);
};

module.exports = mongoose.model('Notification', notificationSchema); 