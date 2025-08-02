const WebSocket = require('ws');
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');

class ChatSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // 存储连接的客户端
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('新的WebSocket连接建立');
      
      // 生成客户端ID
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      // 发送连接确认
      ws.send(JSON.stringify({
        type: 'connection_established',
        clientId: clientId,
        message: 'WebSocket连接已建立'
      }));

      // 处理消息
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: '消息格式错误'
          }));
        }
      });

      // 处理连接关闭
      ws.on('close', () => {
        console.log(`客户端 ${clientId} 断开连接`);
        this.clients.delete(clientId);
      });

      // 处理错误
      ws.on('error', (error) => {
        console.error(`客户端 ${clientId} WebSocket错误:`, error);
        this.clients.delete(clientId);
      });
    });

    console.log('WebSocket服务器已启动');
  }

  generateClientId() {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  handleMessage(clientId, message) {
    const { type, data } = message;

    switch (type) {
      case 'join_session':
        this.handleJoinSession(clientId, data);
        break;
      case 'leave_session':
        this.handleLeaveSession(clientId, data);
        break;
      case 'typing':
        this.handleTyping(clientId, data);
        break;
      case 'stop_typing':
        this.handleStopTyping(clientId, data);
        break;
      default:
        console.log('未知的消息类型:', type);
    }
  }

  handleJoinSession(clientId, data) {
    const { sessionId } = data;
    const ws = this.clients.get(clientId);
    
    if (ws) {
      // 将客户端加入会话房间
      ws.sessionId = sessionId;
      ws.send(JSON.stringify({
        type: 'joined_session',
        sessionId: sessionId,
        message: `已加入会话 ${sessionId}`
      }));
      
      console.log(`客户端 ${clientId} 加入会话 ${sessionId}`);
    }
  }

  handleLeaveSession(clientId, data) {
    const { sessionId } = data;
    const ws = this.clients.get(clientId);
    
    if (ws) {
      delete ws.sessionId;
      ws.send(JSON.stringify({
        type: 'left_session',
        sessionId: sessionId,
        message: `已离开会话 ${sessionId}`
      }));
      
      console.log(`客户端 ${clientId} 离开会话 ${sessionId}`);
    }
  }

  handleTyping(clientId, data) {
    const { sessionId, userId } = data;
    this.broadcastToSession(sessionId, {
      type: 'user_typing',
      sessionId: sessionId,
      userId: userId,
      timestamp: new Date().toISOString()
    }, clientId);
  }

  handleStopTyping(clientId, data) {
    const { sessionId, userId } = data;
    this.broadcastToSession(sessionId, {
      type: 'user_stop_typing',
      sessionId: sessionId,
      userId: userId,
      timestamp: new Date().toISOString()
    }, clientId);
  }

  // 广播消息到指定会话的所有客户端
  broadcastToSession(sessionId, message, excludeClientId = null) {
    this.clients.forEach((ws, clientId) => {
      if (ws.sessionId === sessionId && clientId !== excludeClientId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // 广播消息到所有客户端
  broadcast(message) {
    this.clients.forEach((ws, clientId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // 发送消息到特定客户端
  sendToClient(clientId, message) {
    const ws = this.clients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // 通知新消息
  notifyNewMessage(sessionId, message) {
    this.broadcastToSession(sessionId, {
      type: 'new_message',
      sessionId: sessionId,
      message: message,
      timestamp: new Date().toISOString()
    });
  }

  // 通知会话更新
  notifySessionUpdate(sessionId, sessionData) {
    this.broadcastToSession(sessionId, {
      type: 'session_updated',
      sessionId: sessionId,
      session: sessionData,
      timestamp: new Date().toISOString()
    });
  }

  // 通知会话删除
  notifySessionDeleted(sessionId) {
    this.broadcast({
      type: 'session_deleted',
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });
  }

  // 获取连接统计
  getStats() {
    return {
      totalConnections: this.clients.size,
      activeConnections: Array.from(this.clients.values()).filter(ws => ws.readyState === WebSocket.OPEN).length
    };
  }
}

module.exports = ChatSocketServer; 