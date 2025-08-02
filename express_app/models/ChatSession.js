const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: { //用户关联id
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: true,
    default: '新对话'
  },
  message_count: {
    type: Number,
    default: 0
  },
  last_message_time: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_pinned: {
    type: Boolean,
    default: false
  },
  pinned_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// 添加索引以提高查询性能
chatSessionSchema.index({ created_at: -1 });
chatSessionSchema.index({ updated_at: -1 });
chatSessionSchema.index({ is_active: 1 });
chatSessionSchema.index({ is_pinned: -1, pinned_at: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema); 