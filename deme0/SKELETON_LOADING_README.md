# 骨架加载效果功能说明

## 功能概述

在切换会话聊天时，为聊天页面添加了美观的骨架加载效果，提升用户体验。

## 实现细节

### 1. 骨架加载组件

- **SkeletonMessage**: 单个消息的骨架组件
  - 支持用户消息和AI消息的不同样式
  - 包含闪烁动画和脉冲动画效果
  - 模拟真实消息的布局结构
  - 根据消息类型动态调整文本宽度

- **SkeletonMessages**: 骨架消息列表组件
  - 显示6个骨架消息（3个AI消息，3个用户消息）
  - 在加载时替代真实消息列表
  - 包含加载指示器

- **LoadingIndicator**: 加载指示器组件
  - 旋转的同步图标
  - 加载状态文字提示
  - 现代化的设计风格

### 2. 状态管理

- **isLoadingMessages**: 控制骨架加载的显示/隐藏
- 在以下情况下显示骨架效果：
  - 切换会话时
  - 创建新会话时
  - 创建默认会话时

### 3. 动画效果

- **闪烁动画**: 使用 `Animated.loop` 创建透明度变化
  - 透明度在 0.1 到 0.3 之间循环变化
  - 动画持续时间为 3 秒（1.5秒淡入，1.5秒淡出）

- **脉冲动画**: 使用 `Animated.loop` 创建缩放效果
  - 缩放在 0.98 到 1.02 之间循环变化
  - 动画持续时间为 2 秒（1秒缩小，1秒放大）

- **旋转动画**: 加载指示器的旋转效果
  - 360度连续旋转
  - 动画持续时间为 2 秒

### 4. 样式设计

- **skeletonAvatar**: 头像骨架样式
  - 使用主题色（#4a90e2）的透明背景
  - 添加边框效果
  - 适配平板和手机的不同尺寸

- **skeletonText**: 文本骨架样式
  - 使用主题色的透明背景
  - 添加边框效果
  - 动态宽度变化

- **skeletonTime**: 时间骨架样式
  - 较浅的背景色
  - 较小的尺寸

- **loadingIndicatorContainer**: 加载指示器容器
  - 现代化的卡片设计
  - 主题色背景和边框
  - 圆角设计

### 5. 智能布局

- **动态宽度**: 根据消息类型设置不同的文本宽度
  - 用户消息：60%, 40%, 70%, 50%, 65%
  - AI消息：90%, 85%, 75%, 80%, 70%

- **真实模拟**: 模拟真实对话的布局模式
  - AI消息通常较长，显示多行文本
  - 用户消息通常较短，显示单行文本

## 使用场景

### 1. 切换会话
```typescript
const loadSessionMessages = async (sessionId: string) => {
  setIsLoadingMessages(true); // 显示骨架
  try {
    // 加载消息逻辑
  } finally {
    setIsLoadingMessages(false); // 隐藏骨架
  }
};
```

### 2. 创建新会话
```typescript
const createNewSession = async () => {
  setIsLoadingMessages(true); // 显示骨架
  try {
    // 创建会话逻辑
  } finally {
    setIsLoadingMessages(false); // 隐藏骨架
  }
};
```

### 3. 创建默认会话
在应用初始化和删除最后一个会话时，创建默认会话也会显示骨架效果。

## 渲染逻辑

```typescript
{isLoadingMessages ? (
  <SkeletonMessages />
) : chatMessages.length > 0 ? (
  <View style={styles.messagesContainer}>
    {chatMessages.map(renderMessage)}
  </View>
) : null}
```

## 延迟设置

为了确保用户能看到骨架效果，在 `loadSessionMessages` 中添加了 800ms 的延迟：

```typescript
// 添加延迟以显示骨架效果
await new Promise(resolve => setTimeout(resolve, 800));
```

## 调试信息

骨架组件会在控制台输出调试信息：
- "显示骨架加载效果" - 当骨架组件渲染时
- 可以通过这些信息确认骨架效果是否正常触发

## 兼容性

- 支持平板和手机的不同屏幕尺寸
- 使用 React Native 的 Animated API
- 不依赖第三方动画库
- 支持原生驱动动画（旋转动画）

## 设计特色

### 1. 现代化设计
- 使用主题色系（#4a90e2）
- 透明度和渐变效果
- 圆角和边框设计

### 2. 流畅动画
- 多层动画效果（闪烁+脉冲+旋转）
- 平滑的过渡效果
- 自然的动画时序

### 3. 真实模拟
- 动态文本宽度
- 用户/AI消息区分
- 真实的对话布局

### 4. 用户体验
- 清晰的加载状态提示
- 美观的视觉效果
- 不干扰用户操作

## 未来优化

1. 可以根据实际消息数量动态调整骨架消息数量
2. 可以添加不同类型的骨架样式（图片消息、长文本等）
3. 可以优化动画性能，使用 `useNativeDriver: true`
4. 可以添加加载进度指示器
5. 可以添加骨架消息的渐入渐出效果
6. 可以根据网络速度调整动画速度 