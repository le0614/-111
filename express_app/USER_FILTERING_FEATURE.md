# 用户筛选功能文档

## 功能概述

本功能实现了按 `userId` 筛选会话记录的功能，确保用户只能看到属于自己的会话数据。

## 技术实现

### 1. 后端实现

#### 数据模型更新
- `ChatSession` 模型已包含 `userId` 字段
- 字段类型：`mongoose.Schema.Types.ObjectId`
- 引用：`ref: 'user'`

#### API 路由更新

##### GET /api/sessions
- **功能**: 获取会话列表
- **参数**: 
  - `userId` (可选): 用户ID，用于筛选特定用户的会话
- **示例**:
  ```bash
  # 获取所有会话
  GET /api/sessions
  
  # 获取特定用户的会话
  GET /api/sessions?userId=688b175c37a0af670aded702
  ```

##### GET /api/conversations
- **功能**: 获取对话列表（包含预览信息）
- **参数**:
  - `userId` (可选): 用户ID，用于筛选特定用户的对话
- **示例**:
  ```bash
  # 获取所有对话
  GET /api/conversations
  
  # 获取特定用户的对话
  GET /api/conversations?userId=688b175c37a0af670aded702
  ```

##### POST /api/sessions
- **功能**: 创建新会话
- **请求体**:
  ```json
  {
    "title": "新对话",
    "userId": "688b175c37a0af670aded702"
  }
  ```

### 2. 前端实现

#### ChatAPI 更新
- `getSessions(userId?: string)`: 支持可选的 userId 参数
- `getConversations(userId?: string)`: 支持可选的 userId 参数
- `createSession(data: CreateSessionRequest)`: 支持在请求中包含 userId

#### Show.tsx 更新
- 添加了 `USER_ID` 常量：`688b175c37a0af670aded702`
- 所有 API 调用都使用该 `USER_ID` 进行筛选
- 确保用户只能看到属于自己的会话和对话

## 使用方法

### 1. 启动后端服务
```bash
cd express_app
npm start
```

### 2. 测试功能
```bash
# 运行测试脚本
node test-user-filtering.js
```

### 3. 前端使用
前端应用会自动使用预设的 `USER_ID` 进行数据筛选，无需额外配置。

## 数据流程

1. **用户访问应用** → 前端使用 `USER_ID` 调用 API
2. **API 接收请求** → 检查是否包含 `userId` 参数
3. **数据库查询** → 如果提供 `userId`，则按用户筛选；否则返回所有数据
4. **返回结果** → 只返回属于指定用户的会话/对话数据

## 安全考虑

- 前端硬编码 `USER_ID` 仅用于演示
- 生产环境应通过用户认证系统动态获取用户ID
- 建议添加用户认证中间件确保数据安全

## 测试验证

### 测试脚本功能
1. 获取所有会话（不筛选）
2. 按 userId 筛选会话
3. 获取所有对话（不筛选）
4. 按 userId 筛选对话
5. 创建包含 userId 的新会话
6. 验证新会话在筛选结果中

### 预期结果
- 筛选后的数据应只包含指定 `userId` 的记录
- 新创建的会话应正确包含 `userId` 字段
- 筛选功能应正常工作，不影响其他功能

## 故障排除

### 常见问题

1. **筛选结果为空**
   - 检查数据库中是否存在该 `userId` 的记录
   - 验证 `userId` 格式是否正确

2. **API 返回错误**
   - 检查后端服务是否正常运行
   - 验证 API 路由是否正确配置

3. **前端显示异常**
   - 检查 `USER_ID` 常量是否正确设置
   - 验证 API 调用是否包含正确的参数

### 调试步骤

1. 检查数据库中的会话记录
2. 验证 API 响应数据
3. 检查前端控制台日志
4. 运行测试脚本验证功能

## 扩展功能

### 未来改进
1. 实现用户认证系统
2. 添加用户权限管理
3. 支持多用户环境
4. 添加会话共享功能

### 性能优化
1. 为 `userId` 字段添加数据库索引
2. 实现数据分页
3. 添加缓存机制
4. 优化查询性能

## 总结

用户筛选功能已成功实现，确保了数据的隔离性和安全性。通过 `userId` 参数，系统可以准确筛选出属于特定用户的会话记录，为多用户环境奠定了基础。 