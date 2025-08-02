import axios from 'axios';

// API基础配置
// 在React Native中，localhost需要替换为实际的IP地址
// 如果使用模拟器，可以使用10.0.2.2 (Android) 或 localhost (iOS)
// 如果使用真机，需要使用电脑的局域网IP地址
const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android模拟器
// const API_BASE_URL = 'http://localhost:3000/api'; // iOS模拟器
// const API_BASE_URL = 'http://192.168.1.100:3000/api'; // 真机测试时替换为实际IP

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('API请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('API响应:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API响应错误:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message_time?: string;
}

export interface Conversation {
  id: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  is_pinned?: boolean;
  pinned_at?: string;
  userId?: string;
  last_message?: {
    content: string;
    type: 'user' | 'ai';
    timestamp: string;
  };
  preview: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  type: 'user' | 'ai';
  content: string;
  image_uri?: string;
  image_name?: string;
  image_size?: number;
  timestamp: string;
}

export interface CreateSessionRequest {
  title?: string;
  userId?: string;
}

export interface SendMessageRequest {
  type: 'user' | 'ai';
  content: string;
  image?: {
    uri: string;
    fileName?: string;
    fileSize?: number;
  };
}

export interface SearchRequest {
  q: string;
}

export interface Notification {
  _id: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
  display_duration: number;
  target_audience: 'all' | 'new_users' | 'vip_users';
  is_expired: boolean;
  should_display: boolean;
  created_at: string;
  updated_at: string;
}

// WebSocket相关接口
export interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  timestamp?: string;
  clientId?: string;
  sessionId?: string;
  userId?: string;
}

export interface WebSocketEventHandlers {
  onConnectionEstablished?: (clientId: string) => void;
  onNewMessage?: (message: ChatMessage) => void;
  onSessionUpdated?: (session: ChatSession) => void;
  onSessionDeleted?: (sessionId: string) => void;
  onNewSessionCreated?: (session: ChatSession) => void;
  onUserTyping?: (sessionId: string, userId: string) => void;
  onUserStopTyping?: (sessionId: string, userId: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

class ChatAPI {
  private ws: WebSocket | null = null;
  private clientId: string | null = null;
  private eventHandlers: WebSocketEventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3秒

  // WebSocket连接管理
  connectWebSocket(handlers: WebSocketEventHandlers = {}) {
    this.eventHandlers = handlers;
    
    try {
      // 使用与API相同的地址，但端口和协议不同
      const wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('/api', '');
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        this.eventHandlers.onClose?.();
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        this.eventHandlers.onError?.('WebSocket连接错误');
      };
      
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      this.eventHandlers.onError?.('无法创建WebSocket连接');
    }
  }

  private handleWebSocketMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'connection_established':
        this.clientId = message.clientId || null;
        this.eventHandlers.onConnectionEstablished?.(this.clientId || '');
        break;
        
      case 'new_message':
        if (message.data) {
          this.eventHandlers.onNewMessage?.(message.data);
        }
        break;
        
      case 'session_updated':
        if (message.data) {
          this.eventHandlers.onSessionUpdated?.(message.data);
        }
        break;
        
      case 'session_deleted':
        if (message.sessionId) {
          this.eventHandlers.onSessionDeleted?.(message.sessionId);
        }
        break;
        
      case 'new_session_created':
        if (message.data) {
          this.eventHandlers.onNewSessionCreated?.(message.data);
        }
        break;
        
      case 'user_typing':
        if (message.sessionId && message.userId) {
          this.eventHandlers.onUserTyping?.(message.sessionId, message.userId);
        }
        break;
        
      case 'user_stop_typing':
        if (message.sessionId && message.userId) {
          this.eventHandlers.onUserStopTyping?.(message.sessionId, message.userId);
        }
        break;
        
      case 'error':
        this.eventHandlers.onError?.(message.message || '未知错误');
        break;
        
      default:
        console.log('未处理的WebSocket消息类型:', message.type);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重新连接WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(this.eventHandlers);
      }, this.reconnectInterval);
    } else {
      console.error('WebSocket重连失败，已达到最大重试次数');
      this.eventHandlers.onError?.('WebSocket连接失败，请检查网络连接');
    }
  }

  // 发送WebSocket消息
  sendWebSocketMessage(type: string, data?: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString()
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }

  // 加入会话
  joinSession(sessionId: string) {
    this.sendWebSocketMessage('join_session', { sessionId });
  }

  // 离开会话
  leaveSession(sessionId: string) {
    this.sendWebSocketMessage('leave_session', { sessionId });
  }

  // 发送正在输入状态
  sendTyping(sessionId: string, userId: string) {
    this.sendWebSocketMessage('typing', { sessionId, userId });
  }

  // 发送停止输入状态
  sendStopTyping(sessionId: string, userId: string) {
    this.sendWebSocketMessage('stop_typing', { sessionId, userId });
  }

  // 断开WebSocket连接
  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.clientId = null;
    }
  }
  // 获取所有聊天会话
  async getSessions(userId?: string): Promise<ChatSession[]> {
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient.get('/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('获取会话列表失败:', error);
      throw error;
    }
  }

  // 获取对话列表（包含预览信息）
  async getConversations(userId?: string): Promise<Conversation[]> {
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient.get('/conversations', { params });
      return response.data;
    } catch (error) {
      console.error('获取对话列表失败:', error);
      throw error;
    }
  }

  // 创建新的聊天会话
  async createSession(data: CreateSessionRequest): Promise<ChatSession> {
    try {
      const response = await apiClient.post('/sessions', data);
      return response.data;
    } catch (error) {
      console.error('创建会话失败:', error);
      throw error;
    }
  }

  // 获取特定会话的消息
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error('获取消息失败:', error);
      throw error;
    }
  }

  // 发送消息（支持图片上传）
  async sendMessage(sessionId: string, data: SendMessageRequest): Promise<ChatMessage> {
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('content', data.content);

      // 如果有图片，添加到FormData
      if (data.image) {
        const imageFile = {
          uri: data.image.uri,
          type: 'image/jpeg', // 可以根据实际文件类型调整
          name: data.image.fileName || 'image.jpg',
        };
        formData.append('image', imageFile as any);
      }

      const response = await apiClient.post(`/sessions/${sessionId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }

  // 删除会话
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await apiClient.delete(`/sessions/${sessionId}`);
    } catch (error) {
      console.error('删除会话失败:', error);
      throw error;
    }
  }

  // 更新会话标题
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    try {
      await apiClient.put(`/sessions/${sessionId}`, { title });
    } catch (error) {
      console.error('更新会话标题失败:', error);
      throw error;
    }
  }

  // 切换置顶状态
  async togglePinSession(sessionId: string, isPinned: boolean): Promise<void> {
    try {
      await apiClient.patch(`/sessions/${sessionId}/pin`, { is_pinned: isPinned });
    } catch (error) {
      console.error('切换置顶状态失败:', error);
      throw error;
    }
  }

  // 搜索消息
  async searchMessages(query: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get('/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('搜索消息失败:', error);
      throw error;
    }
  }

  // 健康检查
  async healthCheck(): Promise<any> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('健康检查失败:', error);
      throw error;
    }
  }

  // 获取轮播通知
  async getCarouselNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get('/notifications/carousel');
      return response.data.data || [];
    } catch (error) {
      console.error('获取轮播通知失败:', error);
      throw error;
    }
  }

  // 获取所有活跃通知
  async getActiveNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get('/notifications/');
      return response.data.data || [];
    } catch (error) {
      console.error('获取活跃通知失败:', error);
      throw error;
    }
  }

  // 创建通知
  async createNotification(data: {
    content: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    priority?: number;
    display_duration?: number;
    target_audience?: 'all' | 'new_users' | 'vip_users';
    end_date?: string;
  }): Promise<Notification> {
    try {
      const response = await apiClient.post('/notifications/', data);
      return response.data.data;
    } catch (error) {
      console.error('创建通知失败:', error);
      throw error;
    }
  }

  // 更新通知
  async updateNotification(id: string, data: Partial<Notification>): Promise<Notification> {
    try {
      const response = await apiClient.put(`/notifications/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('更新通知失败:', error);
      throw error;
    }
  }

  // 删除通知
  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('删除通知失败:', error);
      throw error;
    }
  }
}

export default new ChatAPI(); 