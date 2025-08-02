const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image_uri: {
    type: String,
    default: null
  },
  image_name: {
    type: String,
    default: null
  },
  image_size: {
    type: Number,
    default: null
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'timestamp', 
    updatedAt: 'updated_at' 
  }
});

// 添加索引以提高查询性能
chatMessageSchema.index({ session_id: 1, timestamp: -1 });
chatMessageSchema.index({ type: 1 });
chatMessageSchema.index({ is_deleted: 1 });

// 虚拟字段：格式化时间
chatMessageSchema.virtual('formatted_time').get(function() {
  return this.timestamp.toLocaleString('zh-CN');
});

// 确保虚拟字段在JSON序列化时包含
chatMessageSchema.set('toJSON', { virtuals: true });
chatMessageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 