const express = require('express');
const router = express.Router();
const Notification = require('../../models/Notification');

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '通知API服务正常' });
});

// 获取所有活跃的通知
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.getActiveNotifications();
    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取通知列表失败',
      error: error.message
    });
  }
});

// 获取轮播通知（用于前端轮播显示）
router.get('/carousel', async (req, res) => {
  try {
    const notifications = await Notification.getCarouselNotifications();
    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('获取轮播通知失败:', error);
    res.status(500).json({
      success: false,
      message: '获取轮播通知失败',
      error: error.message
    });
  }
});

// 根据ID获取单个通知
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: '通知不存在'
      });
    }
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('获取通知详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取通知详情失败',
      error: error.message
    });
  }
});

// 创建新通知
router.post('/', async (req, res) => {
  try {
    const { content, type, priority, start_date, end_date, display_duration, target_audience } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: '通知内容不能为空'
      });
    }

    const notification = new Notification({
      content,
      type: type || 'info',
      priority: priority || 1,
      start_date: start_date || new Date(),
      end_date: end_date || null,
      display_duration: display_duration || 3000,
      target_audience: target_audience || 'all'
    });

    await notification.save();
    
    res.status(201).json({
      success: true,
      message: '通知创建成功',
      data: notification
    });
  } catch (error) {
    console.error('创建通知失败:', error);
    res.status(500).json({
      success: false,
      message: '创建通知失败',
      error: error.message
    });
  }
});

// 更新通知
router.put('/:id', async (req, res) => {
  try {
    const { content, type, is_active, priority, start_date, end_date, display_duration, target_audience } = req.body;
    
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: '通知不存在'
      });
    }

    // 更新字段
    if (content !== undefined) notification.content = content;
    if (type !== undefined) notification.type = type;
    if (is_active !== undefined) notification.is_active = is_active;
    if (priority !== undefined) notification.priority = priority;
    if (start_date !== undefined) notification.start_date = start_date;
    if (end_date !== undefined) notification.end_date = end_date;
    if (display_duration !== undefined) notification.display_duration = display_duration;
    if (target_audience !== undefined) notification.target_audience = target_audience;

    await notification.save();
    
    res.json({
      success: true,
      message: '通知更新成功',
      data: notification
    });
  } catch (error) {
    console.error('更新通知失败:', error);
    res.status(500).json({
      success: false,
      message: '更新通知失败',
      error: error.message
    });
  }
});

// 删除通知
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: '通知不存在'
      });
    }
    
    res.json({
      success: true,
      message: '通知删除成功'
    });
  } catch (error) {
    console.error('删除通知失败:', error);
    res.status(500).json({
      success: false,
      message: '删除通知失败',
      error: error.message
    });
  }
});

// 批量操作
router.post('/batch', async (req, res) => {
  try {
    const { action, ids } = req.body;
    
    if (!action || !ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: '参数错误'
      });
    }

    let result;
    switch (action) {
      case 'activate':
        result = await Notification.updateMany(
          { _id: { $in: ids } },
          { is_active: true }
        );
        break;
      case 'deactivate':
        result = await Notification.updateMany(
          { _id: { $in: ids } },
          { is_active: false }
        );
        break;
      case 'delete':
        result = await Notification.deleteMany({ _id: { $in: ids } });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: '不支持的操作'
        });
    }

    res.json({
      success: true,
      message: `批量${action}操作成功`,
      affected: result.modifiedCount || result.deletedCount
    });
  } catch (error) {
    console.error('批量操作失败:', error);
    res.status(500).json({
      success: false,
      message: '批量操作失败',
      error: error.message
    });
  }
});

module.exports = router; 