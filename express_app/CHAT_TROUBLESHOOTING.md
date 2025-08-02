# 聊天功能问题排查指南

## 问题：后端没有创建聊天记录

### 可能的原因和解决方案

#### 1. 后端服务器未启动
**症状**: 前端无法连接到后端，显示网络错误
**解决方案**:
```bash
# 进入后端目录
cd -111/express_app

# 启动服务器
npm start
# 或者双击 start-server.bat
```

#### 2. 网络连接问题
**症状**: React Native无法连接到localhost
**解决方案**:
- **Android模拟器**: 使用 `10.0.2.2:3000`
- **iOS模拟器**: 使用 `localhost:3000`
- **真机测试**: 使用电脑的局域网IP，如 `192.168.1.100:3000`

修改 `-111/deme0/src/services/ChatAPI.ts`:
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android模拟器
// const API_BASE_URL = 'http://localhost:3000/api'; // iOS模拟器
// const API_BASE_URL = 'http://192.168.1.100:3000/api'; // 真机
```

#### 3. 数据库连接问题
**症状**: 后端启动时显示数据库连接失败
**解决方案**:
- 检查MongoDB Atlas连接字符串
- 确保网络可以访问MongoDB Atlas
- 检查数据库用户权限

#### 4. CORS配置问题
**症状**: 浏览器显示CORS错误
**解决方案**:
后端已配置CORS，确保前端请求包含正确的headers

#### 5. 端口被占用
**症状**: 服务器启动失败，显示端口被占用
**解决方案**:
```bash
# 查找占用3000端口的进程
netstat -ano | findstr :3000

# 杀死进程
taskkill /PID <进程ID> /F
```

### 诊断步骤

#### 步骤1: 检查后端服务器状态
```bash
cd -111/express_app
node diagnose-chat.js
```

#### 步骤2: 测试API端点
```bash
cd -111/express_app
node debug-chat.js
```

#### 步骤3: 检查前端网络连接
在React Native应用中:
1. 打开开发者菜单
2. 查看网络请求日志
3. 检查是否有网络错误

#### 步骤4: 检查数据库
```bash
# 连接到MongoDB Atlas
# 检查chatsessions和chatmessages集合
```

### 常见错误和解决方案

#### 错误1: ECONNREFUSED
**原因**: 后端服务器未启动
**解决**: 启动后端服务器

#### 错误2: 404 Not Found
**原因**: API路由配置错误
**解决**: 检查路由配置

#### 错误3: 500 Internal Server Error
**原因**: 数据库连接或模型错误
**解决**: 检查数据库连接和模型定义

#### 错误4: CORS Error
**原因**: 跨域请求被阻止
**解决**: 检查CORS配置

### 测试流程

1. **启动后端服务器**
   ```bash
   cd -111/express_app
   npm start
   ```

2. **运行诊断脚本**
   ```bash
   node diagnose-chat.js
   ```

3. **测试API功能**
   ```bash
   node debug-chat.js
   ```

4. **启动前端应用**
   ```bash
   cd -111/deme0
   npx react-native run-android
   # 或
   npx react-native run-ios
   ```

5. **测试聊天功能**
   - 创建新会话
   - 发送消息
   - 检查消息是否保存

### 日志查看

#### 后端日志
后端服务器启动后，查看控制台输出的日志信息

#### 前端日志
在React Native应用中查看网络请求和错误信息

#### 数据库日志
在MongoDB Atlas控制台中查看连接和查询日志

### 联系支持

如果问题仍然存在，请提供以下信息：
1. 错误日志
2. 网络配置
3. 设备信息
4. 复现步骤 