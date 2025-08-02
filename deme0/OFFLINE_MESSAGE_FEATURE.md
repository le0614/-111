# 离线消息发送功能

## 功能概述

实现了完整的离线消息发送功能，当网络断开时，用户发送的消息会被存储到本地，并在网络恢复后自动重发。

## 主要特性

### 1. 离线消息存储
- 使用 `AsyncStorage` 将待发送消息存储到本地
- 支持用户消息和AI回复消息的离线存储
- 消息包含完整的元数据（类型、内容、图片、会话ID等）

### 2. 自动重发机制
- 网络恢复时自动检测并重发待发送消息
- 智能重试机制，最多重试3次
- 重试间隔500ms，避免请求过于频繁

### 3. 消息状态管理
- **sent**: 消息已成功发送
- **pending**: 消息待发送（离线状态）
- **failed**: 消息发送失败（重试次数超限）

### 4. 用户界面反馈
- 红色感叹号图标显示待发送状态
- 发送失败时显示重试按钮
- 头部显示待发送消息数量指示器
- 网络状态实时监控

## 技术实现

### 数据结构

#### ChatMessage 接口扩展
```typescript
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: SelectedImageType;
  status?: 'sent' | 'pending' | 'failed'; // 新增
  sessionId?: string; // 新增
}
```

#### PendingMessage 接口
```typescript
interface PendingMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: SelectedImageType;
  sessionId: string;
  retryCount: number;
}
```

### 核心函数

#### 1. 本地存储管理
```typescript
// 保存待发送消息到本地
const savePendingMessages = async (messages: PendingMessage[])

// 从本地加载待发送消息
const loadPendingMessages = async (): Promise<PendingMessage[]>

// 删除单个待发送消息
const removePendingMessage = async (messageId: string)
```

#### 2. 消息重发机制
```typescript
// 自动重试所有待发送消息
const retryPendingMessages = async ()

// 手动重试单个失败的消息
const retryFailedMessage = async (message: ChatMessage)
```

#### 3. 网络状态监听
```typescript
// 监听网络状态变化，网络恢复时自动重发
const setupNetworkListener = () => {
  return NetInfo.addEventListener(state => {
    // 网络恢复时自动重试待发送消息
    if (!wasConnected && isConnected) {
      setTimeout(() => {
        retryPendingMessages();
      }, 1000);
    }
  });
}
```

### 消息发送流程

1. **在线发送**：
   - 用户输入消息 → 立即发送到服务器 → 状态标记为 `sent`

2. **离线发送**：
   - 用户输入消息 → 添加到本地存储 → 状态标记为 `pending`
   - 显示红色感叹号指示器

3. **网络恢复**：
   - 自动检测网络状态变化
   - 延迟1秒后开始重发待发送消息
   - 成功发送后更新状态为 `sent`，从本地存储移除

4. **重试失败**：
   - 重试3次后仍失败，状态标记为 `failed`
   - 显示重试按钮供用户手动重试

## 用户界面

### 消息状态指示器
- **待发送状态**：红色感叹号 + "待发送" 文字
- **发送失败状态**：红色感叹号 + "发送失败" 文字 + 重试按钮

### 头部指示器
- **待发送消息数量**：橙色背景的圆形指示器，显示待发送消息数量
- **网络状态**：绿色（在线）/ 红色（离线）的WiFi图标

### 重试按钮
- 蓝色边框的小按钮
- 包含刷新图标和"重试"文字
- 点击后立即尝试重新发送

## 错误处理

### 会话不存在
- 检查会话是否还存在，不存在则跳过消息
- 从待发送列表中移除无效消息

### 网络错误
- 捕获网络请求异常
- 自动添加到待发送列表
- 显示用户友好的错误提示

### 重试限制
- 最多重试3次
- 超过限制后标记为失败
- 提供手动重试选项

## 性能优化

### 延迟重试
- 网络恢复后延迟1秒再重试，确保网络稳定
- 重试间隔500ms，避免请求过于频繁

### 批量处理
- 一次性处理所有待发送消息
- 避免重复的网络请求

### 内存管理
- 及时清理已发送的消息
- 避免内存泄漏

## 测试

### 功能测试
1. 断开网络，发送消息
2. 检查消息是否显示为待发送状态
3. 恢复网络，检查是否自动重发
4. 验证消息状态更新

### 边界情况测试
1. 会话被删除时的处理
2. 重试次数超限的处理
3. 应用重启后的消息恢复
4. 网络频繁断连的处理

## 依赖包

```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@react-native-community/netinfo": "^11.4.1"
}
```

## 使用示例

```typescript
// 发送消息（自动处理离线状态）
const handleSendMessage = async () => {
  const message = {
    id: Date.now().toString(),
    type: 'user',
    content: inputText,
    timestamp: new Date(),
    status: isNetworkConnected ? 'sent' : 'pending'
  };
  
  addMessage(message);
  
  if (!isNetworkConnected) {
    // 添加到待发送列表
    const pendingMessage = { ...message, sessionId: currentSession.id, retryCount: 0 };
    setPendingMessages(prev => [...prev, pendingMessage]);
    await savePendingMessages([...pendingMessages, pendingMessage]);
  } else {
    // 立即发送
    await sendMessageToServer(message);
  }
};
```

## 注意事项

1. **图片处理**：离线消息中的图片URI需要确保在重发时仍然有效
2. **会话管理**：确保会话ID在重发时仍然有效
3. **存储限制**：AsyncStorage有存储大小限制，需要定期清理
4. **用户体验**：提供清晰的状态反馈，避免用户困惑

## 未来改进

1. **消息优先级**：为不同类型的消息设置重试优先级
2. **压缩存储**：对大量消息进行压缩存储
3. **同步状态**：与服务器同步消息状态
4. **离线预览**：在离线状态下预览消息效果 