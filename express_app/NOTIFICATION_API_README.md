# 通知消息API文档

## 概述

通知消息API提供了完整的通知管理系统，支持创建、查询、更新和删除通知消息。通知可以用于前端轮播显示、系统公告等功能。

## 数据模型

### Notification Schema

```javascript
{
  content: String,           // 通知内容（必填）
  type: String,              // 通知类型：'info' | 'warning' | 'success' | 'error'
  is_active: Boolean,        // 是否激活
  priority: Number,          // 优先级：1-低，2-中，3-高
  start_date: Date,          // 开始日期
  end_date: Date,            // 结束日期（可选，null表示永不过期）
  display_duration: Number,  // 显示时长（毫秒）
  target_audience: String,   // 目标受众：'all' | 'new_users' | 'vip_users'
  created_at: Date,          // 创建时间
  updated_at: Date           // 更新时间
}
```

### 虚拟字段

- `is_expired`: 是否过期
- `should_display`: 是否应该显示

## API端点

### 基础URL
```
http://localhost:3000/api/notifications
```

### 1. 健康检查
```
GET /health
```

**响应示例：**
```json
{
  "status": "ok",
  "message": "通知API服务正常"
}
```

### 2. 获取轮播通知
```
GET /carousel
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "content": "欢迎使用AI助手，为您提供智能问答服务",
      "type": "success",
      "priority": 2,
      "is_active": true,
      "should_display": true,
      "display_duration": 3000,
      "target_audience": "all",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 3. 获取所有活跃通知
```
GET /
```

**响应示例：**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### 4. 获取单个通知
```
GET /:id
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "通知内容",
    "type": "info",
    "priority": 1,
    "is_active": true,
    "should_display": true,
    "display_duration": 3000,
    "target_audience": "all",
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z"
  }
}
```

### 5. 创建通知
```
POST /
```

**请求体：**
```json
{
  "content": "新通知内容",
  "type": "info",
  "priority": 2,
  "display_duration": 3000,
  "target_audience": "all",
  "end_date": "2023-12-31T23:59:59.000Z"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "通知创建成功",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "新通知内容",
    "type": "info",
    "priority": 2,
    "is_active": true,
    "should_display": true,
    "display_duration": 3000,
    "target_audience": "all",
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z"
  }
}
```

### 6. 更新通知
```
PUT /:id
```

**请求体：**
```json
{
  "content": "更新后的通知内容",
  "priority": 3,
  "is_active": false
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "通知更新成功",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "更新后的通知内容",
    "priority": 3,
    "is_active": false,
    "should_display": false
  }
}
```

### 7. 删除通知
```
DELETE /:id
```

**响应示例：**
```json
{
  "success": true,
  "message": "通知删除成功"
}
```

### 8. 批量操作
```
POST /batch
```

**请求体：**
```json
{
  "action": "activate",  // "activate" | "deactivate" | "delete"
  "ids": ["60f7b3b3b3b3b3b3b3b3b3b3", "60f7b3b3b3b3b3b3b3b3b3b4"]
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "批量activate操作成功",
  "affected": 2
}
```

## 前端集成

### 1. 获取轮播通知
```typescript
import ChatAPI from '../services/ChatAPI';

const loadNotifications = async () => {
  try {
    const notifications = await ChatAPI.getCarouselNotifications();
    const noticeContents = notifications.map(notification => notification.content);
    setNotices(noticeContents);
  } catch (error) {
    console.error('加载通知数据失败:', error);
  }
};
```

### 2. 创建通知
```typescript
const createNotification = async () => {
  try {
    const notification = await ChatAPI.createNotification({
      content: "新通知内容",
      type: "info",
      priority: 2,
      display_duration: 3000,
      target_audience: "all"
    });
    console.log('通知创建成功:', notification);
  } catch (error) {
    console.error('创建通知失败:', error);
  }
};
```

## 使用示例

### 1. 初始化通知数据
```bash
cd express_app
node init-notifications.js
```

### 2. 测试API
```bash
cd express_app
node test-notifications.js
```

### 3. 启动服务器
```bash
cd express_app
npm start
```

## 错误处理

所有API端点都包含完整的错误处理：

- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

错误响应格式：
```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

## 注意事项

1. 通知按优先级和创建时间排序
2. 只有活跃且未过期的通知会被返回
3. 轮播通知限制为最多10条
4. 虚拟字段 `is_expired` 和 `should_display` 会自动计算
5. 时间字段使用ISO 8601格式 