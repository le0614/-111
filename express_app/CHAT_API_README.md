# 聊天API使用说明

## 概述

这是一个完整的聊天系统API，支持会话管理、消息发送、图片上传等功能。API基于Express.js和MongoDB构建。

## 功能特性

- ✅ 会话管理（创建、删除、更新）
- ✅ 消息发送和接收
- ✅ 图片上传支持
- ✅ 消息搜索
- ✅ 实时网络状态检测
- ✅ 数据持久化存储

## API端点

### 基础信息

- **基础URL**: `http://localhost:3000/api`
- **内容类型**: `application/json`
- **文件上传**: `multipart/form-data`

### 健康检查

```
GET /api/health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "聊天API服务正常运行"
}
```

### 会话管理

#### 获取所有会话
```
GET /api/sessions
```

#### 创建新会话
```
POST /api/sessions
Content-Type: application/json

{
  "title": "新对话"
}
```

#### 更新会话标题
```
PUT /api/sessions/:sessionId
Content-Type: application/json

{
  "title": "新标题"
}
```

#### 删除会话
```
DELETE /api/sessions/:sessionId
```

### 消息管理

#### 获取会话消息
```
GET /api/sessions/:sessionId/messages
```

#### 发送消息
```
POST /api/sessions/:sessionId/messages
Content-Type: multipart/form-data

{
  "type": "user|ai",
  "content": "消息内容",
  "image": [可选] 图片文件
}
```

#### 搜索消息
```
GET /api/search?q=搜索关键词
```

### 对话列表

#### 获取对话列表（包含预览）
```
GET /api/conversations
```

## 数据模型

### ChatSession（聊天会话）

```javascript
{
  _id: ObjectId,
  title: String,           // 会话标题
  message_count: Number,   // 消息数量
  last_message_time: Date, // 最后消息时间
  is_active: Boolean,      // 是否活跃
  created_at: Date,        // 创建时间
  updated_at: Date         // 更新时间
}
```

### ChatMessage（聊天消息）

```javascript
{
  _id: ObjectId,
  session_id: ObjectId,    // 关联的会话ID
  type: String,            // 消息类型: 'user' | 'ai'
  content: String,         // 消息内容
  image_uri: String,       // 图片URI（可选）
  image_name: String,      // 图片名称（可选）
  image_size: Number,      // 图片大小（可选）
  is_deleted: Boolean,     // 是否删除
  timestamp: Date,         // 发送时间
  updated_at: Date         // 更新时间
}
```

## 安装和运行

### 1. 安装依赖

```bash
cd express_app
npm install
```

### 2. 配置数据库

确保MongoDB连接字符串在 `databases/database.js` 中正确配置。

### 3. 启动服务器

```bash
npm start
```

### 4. 测试API

```bash
node test-chat-api.js
```

## 前端集成

### React Native 示例

```javascript
import ChatAPI from './services/ChatAPI';

// 创建会话
const session = await ChatAPI.createSession({ title: '新对话' });

// 发送消息
const message = await ChatAPI.sendMessage(session.id, {
  type: 'user',
  content: '你好'
});

// 获取消息列表
const messages = await ChatAPI.getMessages(session.id);
```

## 错误处理

API使用标准HTTP状态码：

- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

错误响应格式：
```json
{
  "error": "错误描述",
  "message": "详细错误信息"
}
```

## 文件上传

### 支持的图片格式
- JPEG
- PNG
- GIF
- WebP

### 文件大小限制
- 最大10MB

### 上传目录
- 文件保存在 `uploads/chat/` 目录
- 自动生成唯一文件名

## 性能优化

- 数据库索引优化
- 分页查询支持
- 软删除机制
- 文件上传限制

## 安全考虑

- 文件类型验证
- 文件大小限制
- 输入数据验证
- CORS配置

## 开发建议

1. 在生产环境中添加用户认证
2. 实现消息加密
3. 添加API限流
4. 配置日志记录
5. 添加监控和告警

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MongoDB连接字符串
   - 确认网络连接

2. **文件上传失败**
   - 检查上传目录权限
   - 确认文件大小限制

3. **API响应慢**
   - 检查数据库索引
   - 优化查询语句

### 日志查看

服务器日志会输出到控制台，包括：
- 请求日志
- 错误信息
- 数据库操作

## 更新日志

### v1.0.0
- 初始版本发布
- 基础聊天功能
- 图片上传支持
- 消息搜索功能 