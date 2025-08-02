<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, Image, Dimensions, Animated, RefreshControl } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatAPI, { ChatSession, ChatMessage as APIChatMessage, Conversation, Notification, WebSocketEventHandlers } from '../services/ChatAPI';

// 获取屏幕尺寸
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 判断设备类型
const isTablet = screenWidth >= 768;
const isLargeTablet = screenWidth >= 1024;

// 用户ID常量
const USER_ID = '688b175c37a0af670aded702';

interface SelectedImageType {
  uri: string;
  fileName?: string;
  fileSize?: number;
=======
import React,{useEffect} from 'react'
import { View,  Text, Alert,Button} from'react-native';
import axios from 'axios';
// import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Show({route}:any) {
  // const { item } =route.params
  // console.log(route.params?.item.apiKey);
  useEffect(()=>{
    axios.post(`http://192.168.222.89:3000/ss/getdata?apiKey=${route.params?.item.apiKey}`).then(res=>{
      console.log(res)
    })
    storeData()
  },[route.params?.item.apiKey])
  const storeData = async () => {
    try {
      await AsyncStorage.setItem('my-key', route.params?.item.apiKey);
    } catch (e) {
      // saving error
    }
  };
  // const route=useRoute()

  
  
  return (
   <View><Text>
    {/* {name} */}
    首页
    {/* <Button 
    onPress={()=>{getData}}
    ></Button> */}
    </Text></View>
  )
>>>>>>> 6de242476fe4188b2e99517766013dbb059211fa
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: SelectedImageType;
  status?: 'sent' | 'pending' | 'failed'; // 新增消息状态
  sessionId?: string; // 新增会话ID，用于离线消息重发
}

// 待发送消息接口
interface PendingMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: SelectedImageType;
  sessionId: string;
  retryCount: number;
}

// 骨架加载组件
const SkeletonMessage = ({ isUser, index }: { isUser: boolean; index: number }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 闪烁动画
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    // 脉冲动画
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startShimmer();
    startPulse();
  }, [shimmerAnim, pulseAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0.98, 1.02],
  });

  // 根据索引设置不同的文本宽度，模拟真实对话
  const getTextWidths = () => {
    if (isUser) {
      // 用户消息通常较短
      const widths = [60, 40, 70, 50, 65];
      return widths[index % widths.length];
    } else {
      // AI消息通常较长
      const widths = [90, 85, 75, 80, 70];
      return widths[index % widths.length];
    }
  };

  const textWidths = getTextWidths();

  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Animated.View 
            style={[
              styles.skeletonAvatar,
              { 
                opacity: shimmerOpacity,
                transform: [{ scale: pulseScale }]
              }
            ]} 
          />
        </View>
      )}
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Animated.View 
          style={[
            styles.skeletonText,
            { 
              width: textWidths, 
              opacity: shimmerOpacity,
              transform: [{ scale: pulseScale }]
            }
          ]} 
        />
        {!isUser && (
          <Animated.View 
            style={[
              styles.skeletonText,
              { 
                width: '70%', 
                opacity: shimmerOpacity,
                transform: [{ scale: pulseScale }]
              }
            ]} 
          />
        )}
        <Animated.View 
          style={[
            styles.skeletonTime,
            { 
              opacity: shimmerOpacity,
              transform: [{ scale: pulseScale }]
            }
          ]} 
        />
      </View>
    </View>
  );
};

// 加载指示器组件
const LoadingIndicator = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingIndicatorContainer}>
      <Animated.View style={[styles.loadingIndicator, { transform: [{ rotate: spin }] }]}>
        <Icon name="sync" size={24} color="rgba(74, 144, 226, 0.6)" />
      </Animated.View>
      <Text style={styles.loadingText}>正在加载对话...</Text>
    </View>
  );
};

// 骨架加载消息列表组件
const SkeletonMessages = () => {
  console.log('显示骨架加载效果');
  return (
    <View style={styles.messagesContainer}>
      <LoadingIndicator />
      <SkeletonMessage isUser={false} index={0} />
      <SkeletonMessage isUser={true} index={1} />
      <SkeletonMessage isUser={false} index={2} />
      <SkeletonMessage isUser={true} index={3} />
      <SkeletonMessage isUser={false} index={4} />
      <SkeletonMessage isUser={true} index={5} />
    </View>
  );
};

export default function Show() {
  const [selectedImage, setSelectedImage] = useState<SelectedImageType | null>(null);
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // 新增状态管理
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // 网络状态管理
  const [isNetworkConnected, setIsNetworkConnected] = useState(true);
  const [showNetworkAlert, setShowNetworkAlert] = useState(false);
  
  // 重新加载状态
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 旋转动画
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // WebSocket状态
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 骨架加载状态
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // 离线消息管理
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [isRetryingMessages, setIsRetryingMessages] = useState(false);

  // 轮播通知内容
  const [notices, setNotices] = useState<string[]>([
    "现可以正常使用! 如遇程序问题,请加",
    "欢迎使用AI助手，为您提供智能问答服务",
    "支持文字和图片输入，让交流更便捷",
    "点击建议问题快速开始对话",
    "新功能上线：图片识别与分析"
  ]);

  // 建议问题数组
  const [suggestions, setSuggestions] = useState([
    "如何在一个月内赚到一百万",
    "PHP是世界上最好的语言吗",
    "如何给女朋友写土味情话",
    "换一换"
  ]);



  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('用户取消了图片选择');
      } else if (response.errorCode) {
        Alert.alert('错误', '选择图片时出现错误: ' + response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const image = response.assets[0];
        setSelectedImage({
          uri: image.uri || '',
          fileName: image.fileName,
          fileSize: image.fileSize,
        });
        // 图片选择成功，无需弹框提示
      }
    });
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // 本地存储相关函数
  const savePendingMessages = async (messages: PendingMessage[]) => {
    try {
      await AsyncStorage.setItem('pendingMessages', JSON.stringify(messages));
      console.log('待发送消息已保存到本地存储');
    } catch (error) {
      console.error('保存待发送消息失败:', error);
    }
  };

  const loadPendingMessages = async (): Promise<PendingMessage[]> => {
    try {
      const stored = await AsyncStorage.getItem('pendingMessages');
      if (stored) {
        const messages = JSON.parse(stored);
        // 转换时间戳字符串为Date对象
        return messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('加载待发送消息失败:', error);
      return [];
    }
  };

  const removePendingMessage = async (messageId: string) => {
    try {
      const updatedMessages = pendingMessages.filter(msg => msg.id !== messageId);
      setPendingMessages(updatedMessages);
      await savePendingMessages(updatedMessages);
    } catch (error) {
      console.error('删除待发送消息失败:', error);
    }
  };

  // 重试待发送消息
  const retryPendingMessages = async () => {
    if (pendingMessages.length === 0 || isRetryingMessages) {
      return;
    }

    setIsRetryingMessages(true);
    console.log('开始重试待发送消息，共', pendingMessages.length, '条');

    try {
      for (const pendingMsg of pendingMessages) {
        try {
          // 检查会话是否还存在
          const sessions = await ChatAPI.getSessions();
          const sessionExists = sessions.some(session => session.id === pendingMsg.sessionId);
          
          if (!sessionExists) {
            console.log('会话不存在，跳过消息:', pendingMsg.id);
            await removePendingMessage(pendingMsg.id);
            continue;
          }

          // 发送消息到服务器
          const messageData = {
            type: pendingMsg.type,
            content: pendingMsg.content,
            image: pendingMsg.image
          };
          
          await ChatAPI.sendMessage(pendingMsg.sessionId, messageData);
          console.log('待发送消息重试成功:', pendingMsg.id);
          
          // 从待发送列表中移除
          await removePendingMessage(pendingMsg.id);
          
          // 更新聊天消息状态
          setChatMessages(prev => prev.map(msg => 
            msg.id === pendingMsg.id 
              ? { ...msg, status: 'sent' as const }
              : msg
          ));
          
        } catch (error) {
          console.error('重试消息失败:', pendingMsg.id, error);
          
          // 增加重试次数
          const updatedMessages = pendingMessages.map(msg => 
            msg.id === pendingMsg.id 
              ? { ...msg, retryCount: msg.retryCount + 1 }
              : msg
          );
          
          // 如果重试次数超过3次，标记为失败
          if (pendingMsg.retryCount >= 3) {
            console.log('消息重试次数超过限制，标记为失败:', pendingMsg.id);
            await removePendingMessage(pendingMsg.id);
            
            // 更新聊天消息状态为失败
            setChatMessages(prev => prev.map(msg => 
              msg.id === pendingMsg.id 
                ? { ...msg, status: 'failed' as const }
                : msg
            ));
          } else {
            setPendingMessages(updatedMessages);
            await savePendingMessages(updatedMessages);
          }
        }
        
        // 添加延迟避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } finally {
      setIsRetryingMessages(false);
    }
  };

  // 手动重试单个失败的消息
  const retryFailedMessage = async (message: ChatMessage) => {
    if (!currentSession || !isNetworkConnected) {
      Alert.alert('提示', '请检查网络连接后重试');
      return;
    }

    try {
      // 更新消息状态为待发送
      setChatMessages(prev => prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, status: 'pending' as const }
          : msg
      ));

      // 添加到待发送列表
      const pendingMessage: PendingMessage = {
        ...message,
        sessionId: currentSession.id,
        retryCount: 0
      };
      
      const updatedPendingMessages = [...pendingMessages, pendingMessage];
      setPendingMessages(updatedPendingMessages);
      await savePendingMessages(updatedPendingMessages);

      // 立即尝试发送
      await sendMessageToServer(message);
      
    } catch (error) {
      console.error('手动重试消息失败:', error);
      Alert.alert('错误', '重试失败，请稍后重试');
    }
  };

  // 处理输入状态变化
  const handleInputChange = (text: string) => {
    setInputText(text);
    
    // 发送正在输入状态
    if (currentSession && text.trim()) {
      ChatAPI.sendTyping(currentSession.id, 'user');
      
      // 清除之前的超时
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // 设置新的超时，停止输入状态
      typingTimeoutRef.current = setTimeout(() => {
        if (currentSession) {
          ChatAPI.sendStopTyping(currentSession.id, 'user');
        }
      }, 2000); // 2秒后停止输入状态
    }
  };

  // WebSocket事件处理函数
  const setupWebSocket = () => {
    const handlers: WebSocketEventHandlers = {
      onConnectionEstablished: (clientId) => {
        console.log('WebSocket连接已建立，客户端ID:', clientId);
        setIsWebSocketConnected(true);
      },
      
      onNewMessage: (message) => {
        console.log('收到新消息:', message);
        // 如果是当前会话的消息，添加到聊天记录
        if (currentSession && message.session_id === currentSession.id) {
          const newMessage: ChatMessage = {
            id: message.id,
            type: message.type,
            content: message.content,
            timestamp: new Date(message.timestamp),
            image: message.image_uri ? {
              uri: message.image_uri,
              fileName: message.image_name,
              fileSize: message.image_size
            } : undefined
          };
          setChatMessages(prev => [...prev, newMessage]);
        }
      },
      
      onSessionUpdated: (session) => {
        console.log('会话已更新:', session);
        // 更新会话列表
        setSessions(prev => prev.map(s => 
          s.id === session.id ? { ...s, ...session } : s
        ));
        setConversations(prev => prev.map(c => 
          c.id === session.id ? { ...c, ...session } : c
        ));
        
        // 如果是当前会话，更新当前会话信息
        if (currentSession && currentSession.id === session.id) {
          setCurrentSession(prev => prev ? { ...prev, ...session } : null);
        }
      },
      
      onSessionDeleted: (sessionId) => {
        console.log('会话已删除:', sessionId);
        // 从会话列表中移除
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setConversations(prev => prev.filter(c => c.id !== sessionId));
        
        // 如果是当前会话被删除，清空当前会话
        if (currentSession && currentSession.id === sessionId) {
          setCurrentSession(null);
          setChatMessages([]);
        }
      },
      
      onNewSessionCreated: (session) => {
        console.log('新会话已创建:', session);
        // 添加到会话列表
        setSessions(prev => [session, ...prev]);
        setConversations(prev => [{
          id: session.id,
          title: session.title,
          message_count: session.message_count || 0,
          created_at: session.created_at,
          updated_at: session.updated_at,
          preview: '暂无消息'
        }, ...prev]);
      },
      
      onUserTyping: (sessionId, userId) => {
        console.log('用户正在输入:', sessionId, userId);
        if (currentSession && sessionId === currentSession.id) {
          setTypingUsers(prev => new Set(prev).add(userId));
        }
      },
      
      onUserStopTyping: (sessionId, userId) => {
        console.log('用户停止输入:', sessionId, userId);
        if (currentSession && sessionId === currentSession.id) {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }
      },
      
      onError: (error) => {
        console.error('WebSocket错误:', error);
        setIsWebSocketConnected(false);
      },
      
      onClose: () => {
        console.log('WebSocket连接已关闭');
        setIsWebSocketConnected(false);
      }
    };
    
    ChatAPI.connectWebSocket(handlers);
  };

  const addMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) {
      Alert.alert('提示', '请输入问题或选择图片');
      return;
    }

    // 如果没有当前会话，创建一个新的
    if (!currentSession) {
      await createNewSession();
    }

    // 保存输入内容用于AI回复
    const userInputText = inputText.trim();

    // 发送停止输入状态
    if (currentSession) {
      ChatAPI.sendStopTyping(currentSession.id, 'user');
    }

    // 立即清空输入框和图片
    setInputText('');
    setSelectedImage(null);

    // 添加用户消息到聊天记录
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInputText,
      timestamp: new Date(),
      image: selectedImage || undefined,
      sessionId: currentSession?.id,
      status: isNetworkConnected ? 'sent' : 'pending'
    };
    addMessage(userMessage);

    // 检查网络连接状态
    if (!isNetworkConnected) {
      // 离线状态：添加到待发送列表
      const pendingMessage: PendingMessage = {
        ...userMessage,
        sessionId: currentSession?.id || '',
        retryCount: 0
      };
      
      const updatedPendingMessages = [...pendingMessages, pendingMessage];
      setPendingMessages(updatedPendingMessages);
      await savePendingMessages(updatedPendingMessages);
      
      console.log('消息已添加到待发送列表，等待网络恢复后自动发送');
      return;
    }

    // 在线状态：发送消息到服务器
    await sendMessageToServer(userMessage);

    // 模拟网络延迟和AI回复
    setTimeout(async () => {
      // 模拟AI回复
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `收到您的问题：${userInputText}\n\n我正在为您分析这个问题，请稍等...`,
        timestamp: new Date(),
        sessionId: currentSession?.id,
        status: isNetworkConnected ? 'sent' : 'pending'
      };
      addMessage(aiMessage);

      // 检查网络状态，如果离线则添加到待发送列表
      if (!isNetworkConnected) {
        const pendingAiMessage: PendingMessage = {
          ...aiMessage,
          sessionId: currentSession?.id || '',
          retryCount: 0
        };
        
        const updatedPendingMessages = [...pendingMessages, pendingAiMessage];
        setPendingMessages(updatedPendingMessages);
        await savePendingMessages(updatedPendingMessages);
      } else {
        // 发送AI回复到服务器
        await sendMessageToServer(aiMessage);
      }

      console.log('发送的内容:', userInputText);
    }, 1000);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    // 如果是"换一换"，则更新建议数组
    if (suggestionText === "换一换") {
      const allSuggestions = [
        [
          "如何在一个月内赚到一百万",
          "PHP是世界上最好的语言吗",
          "如何给女朋友写土味情话",
          "换一换"
        ],
        [
          "如何提高工作效率",
          "推荐几本好书",
          "如何学习一门新技能",
          "换一换"
        ],
        [
          "如何保持健康的生活方式",
          "如何改善人际关系",
          "如何管理个人财务",
          "换一换"
        ],
        [
          "如何培养良好的习惯",
          "如何提升沟通技巧",
          "如何平衡工作与生活",
          "换一换"
        ]
      ];

      // 随机选择一个不同的建议数组
      let newSuggestions;
      do {
        newSuggestions = allSuggestions[Math.floor(Math.random() * allSuggestions.length)];
      } while (JSON.stringify(newSuggestions) === JSON.stringify(suggestions));

      setSuggestions(newSuggestions);
    } else {
      // 将建议文本填充到输入框
      setInputText(suggestionText);
    }
  };

  // 加载通知数据
  const loadNotifications = async () => {
    try {
      const notifications = await ChatAPI.getCarouselNotifications();
      if (notifications.length > 0) {
        const noticeContents = notifications.map(notification => notification.content);
        setNotices(noticeContents);
        console.log('加载通知数据成功:', noticeContents.length);
      }
    } catch (error) {
      console.error('加载通知数据失败:', error);
      // 如果加载失败，使用默认通知
    }
  };

  // API集成方法
  const checkServerConnection = async () => {
    try {
      await ChatAPI.healthCheck();
      setIsConnected(true);
      console.log('服务器连接成功');
    } catch (error) {
      setIsConnected(false);
      console.log('服务器连接失败:', error);
    }
  };

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const sessionsData = await ChatAPI.getSessions(USER_ID);
      setSessions(sessionsData);
      console.log('加载会话列表成功:', sessionsData.length);
    } catch (error) {
      console.error('加载会话列表失败:', error);
      Alert.alert('错误', '加载会话列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const conversationsData = await ChatAPI.getConversations(USER_ID);
      setConversations(conversationsData);
      console.log('加载对话列表成功:', conversationsData.length);
    } catch (error) {
      console.error('加载对话列表失败:', error);
      Alert.alert('错误', '加载对话列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      // 显示骨架加载效果
      setIsLoadingMessages(true);
      
      const newSession = await ChatAPI.createSession({ 
        title: '新对话',
        userId: USER_ID
      });
      setCurrentSession(newSession);
      setChatMessages([]);
      await loadSessions();
      await loadConversations(); // 同时更新对话列表
      console.log('创建新会话成功:', newSession.id);
      // 关闭抽屉
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('创建会话失败:', error);
      Alert.alert('错误', '创建会话失败');
    } finally {
      // 隐藏骨架加载效果
      setIsLoadingMessages(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      // 显示骨架加载效果
      setIsLoadingMessages(true);
      
      // 离开之前的会话
      if (currentSession) {
        ChatAPI.leaveSession(currentSession.id);
      }
      
      // 添加延迟以显示骨架效果
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const messages = await ChatAPI.getMessages(sessionId);
      const convertedMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        image: msg.image_uri ? {
          uri: `http://localhost:3000${msg.image_uri}`,
          fileName: msg.image_name,
          fileSize: msg.image_size
        } : undefined
      }));
      setChatMessages(convertedMessages);
      console.log('加载消息成功:', convertedMessages.length);
      
      // 加入新会话
      ChatAPI.joinSession(sessionId);
    } catch (error) {
      console.error('加载消息失败:', error);
      Alert.alert('错误', '加载消息失败');
    } finally {
      // 隐藏骨架加载效果
      setIsLoadingMessages(false);
    }
  };

  const sendMessageToServer = async (message: ChatMessage) => {
    if (!currentSession) {
      console.error('没有当前会话');
      return;
    }

    try {
      const messageData = {
        type: message.type,
        content: message.content,
        image: message.image
      };
      
      await ChatAPI.sendMessage(currentSession.id, messageData);
      console.log('消息发送到服务器成功');
      
      // 更新消息状态为已发送
      setChatMessages(prev => prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, status: 'sent' as const }
          : msg
      ));
    } catch (error) {
      console.error('发送消息到服务器失败:', error);
      
      // 更新消息状态为失败
      setChatMessages(prev => prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, status: 'failed' as const }
          : msg
      ));
      
      // 如果网络断开，添加到待发送列表
      if (!isNetworkConnected) {
        const pendingMessage: PendingMessage = {
          ...message,
          sessionId: currentSession.id,
          retryCount: 0
        };
        
        const updatedPendingMessages = [...pendingMessages, pendingMessage];
        setPendingMessages(updatedPendingMessages);
        await savePendingMessages(updatedPendingMessages);
        
        console.log('消息已添加到待发送列表，等待网络恢复后重试');
      } else {
        Alert.alert('错误', '消息发送失败');
      }
    }
  };

  // 删除会话
  const handleDeleteSession = async (sessionId: string, sessionTitle: string) => {
    Alert.alert(
      '确认删除',
      `确定要删除对话"${sessionTitle}"吗？此操作不可撤销。`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await ChatAPI.deleteSession(sessionId);
              console.log('删除会话成功:', sessionId);
              
              // 如果删除的是当前会话，清空当前会话
              if (currentSession?.id === sessionId) {
                setCurrentSession(null);
                setChatMessages([]);
              }
              
              // 重新加载会话列表
              await loadSessions();
              await loadConversations();
              
              // 检查删除后是否还有对话，如果没有则创建默认对话
              const updatedSessions = await ChatAPI.getSessions();
              const updatedConversations = await ChatAPI.getConversations();
              
              if (updatedSessions.length === 0 && updatedConversations.length === 0) {
                console.log('删除后没有对话，创建默认对话');
                try {
                  // 显示骨架加载效果
                  setIsLoadingMessages(true);
                  
                  const defaultSession = await ChatAPI.createSession({ title: '欢迎使用AI助手' });
                  setCurrentSession(defaultSession);
                  setChatMessages([]);
                  await loadSessions();
                  console.log('默认对话创建成功:', defaultSession.id);
                } catch (error) {
                  console.error('创建默认对话失败:', error);
                } finally {
                  // 隐藏骨架加载效果
                  setIsLoadingMessages(false);
                }
              }
              
              Alert.alert('成功', '对话已删除');
            } catch (error) {
              console.error('删除会话失败:', error);
              Alert.alert('错误', '删除对话失败，请重试');
            }
          },
        },
      ]
    );
  };

  // 置顶/取消置顶会话
  const handleTogglePinSession = async (sessionId: string, sessionTitle: string, newPinState: boolean) => {
    try {
      await ChatAPI.togglePinSession(sessionId, newPinState);
      console.log('切换置顶状态成功:', sessionId, newPinState);
      
      // 重新加载会话列表
      await loadSessions();
      await loadConversations();
      
      Alert.alert('成功', newPinState ? '对话已置顶' : '对话已取消置顶');
    } catch (error) {
      console.error('切换置顶状态失败:', error);
      Alert.alert('错误', '操作失败，请重试');
    }
  };

  // 修改对话名称
  const handleEditSessionTitle = async (sessionId: string, currentTitle: string) => {
    Alert.prompt(
      '修改对话名称',
      '请输入新的对话名称：',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async (newTitle: any) => {
            if (!newTitle || newTitle.trim().length === 0) {
              Alert.alert('错误', '对话名称不能为空');
              return;
            }
            
            if (newTitle.trim() === currentTitle) {
              return; // 没有变化，不需要更新
            }
            
            try {
              await ChatAPI.updateSessionTitle(sessionId, newTitle.trim());
              console.log('更新对话名称成功:', sessionId, newTitle.trim());
              
              // 重新加载会话列表
              await loadSessions();
              await loadConversations();
              
              // 如果修改的是当前会话，更新当前会话标题
              if (currentSession?.id === sessionId) {
                setCurrentSession(prev => prev ? { ...prev, title: newTitle.trim() } : null);
              }
              
              Alert.alert('成功', '对话名称已更新');
            } catch (error) {
              console.error('更新对话名称失败:', error);
              Alert.alert('错误', '更新失败，请重试');
            }
          },
        },
      ],
      'plain-text',
      currentTitle
    );
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // 网络状态检测函数
  const checkNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      const wasConnected = isNetworkConnected;
      const isConnected = !!(state.isConnected && state.isInternetReachable);
      
      setIsNetworkConnected(isConnected);
      
      // 如果网络状态发生变化，显示提示
      if (wasConnected && !isConnected) {
        setShowNetworkAlert(true);
        // 3秒后自动隐藏提示
        setTimeout(() => {
          setShowNetworkAlert(false);
        }, 3000);
      } else if (!wasConnected && isConnected) {
        setShowNetworkAlert(true);
        // 网络恢复时显示成功提示，2秒后隐藏
        setTimeout(() => {
          setShowNetworkAlert(false);
        }, 2000);
      }
    } catch (error) {
      console.error('检查网络状态失败:', error);
    }
  };

  // 监听网络状态变化
  const setupNetworkListener = () => {
    return NetInfo.addEventListener(state => {
      const wasConnected = isNetworkConnected;
      const isConnected = !!(state.isConnected && state.isInternetReachable);
      
      setIsNetworkConnected(isConnected);
      
      // 如果网络状态发生变化，显示提示
      if (wasConnected && !isConnected) {
        setShowNetworkAlert(true);
        // 3秒后自动隐藏提示
        setTimeout(() => {
          setShowNetworkAlert(false);
        }, 3000);
      } else if (!wasConnected && isConnected) {
        setShowNetworkAlert(true);
        // 网络恢复时显示成功提示，2秒后隐藏
        setTimeout(() => {
          setShowNetworkAlert(false);
        }, 2000);
        
        // 网络恢复时自动重试待发送消息
        setTimeout(() => {
          retryPendingMessages();
        }, 1000); // 延迟1秒后开始重试，确保网络稳定
      }
    });
  };

  // 重新加载页面数据
  const handleRefresh = async () => {
    if (isRefreshing) return; // 防止重复点击
    
    setIsRefreshing(true);
    
    // 开始旋转动画
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        if (isRefreshing) {
          startRotation(); // 如果还在刷新，继续旋转
        }
      });
    };
    startRotation();
    
    try {
      // 重新检查网络状态
      await checkNetworkStatus();
      
      // 重新加载服务器连接状态
      await checkServerConnection();
      
      // 重新加载会话列表
      await loadSessions();
      
      // 重新加载对话列表
      await loadConversations();
      
      // 重新加载通知数据
      await loadNotifications();
      
      // 如果当前有会话，重新加载消息
      if (currentSession) {
        await loadSessionMessages(currentSession.id);
      }
      
      // 显示成功提示
      Alert.alert('刷新成功', '页面数据已更新');
      
    } catch (error) {
      console.error('重新加载失败:', error);
      Alert.alert('刷新失败', '请检查网络连接后重试');
    } finally {
      setIsRefreshing(false);
      // 停止动画
      rotateAnim.stopAnimation();
    }
  };

  // 初始化效果
  useEffect(() => {
    const initializeApp = async () => {
      // 加载待发送消息
      const storedPendingMessages = await loadPendingMessages();
      setPendingMessages(storedPendingMessages);
      console.log('加载待发送消息:', storedPendingMessages.length, '条');
      
      await checkServerConnection();
      await loadSessions();
      await loadConversations();
      await loadNotifications(); // 加载通知数据
      
      // 检查是否有对话，如果没有则创建默认对话
      const sessionsData = await ChatAPI.getSessions();
      const conversationsData = await ChatAPI.getConversations();
      
      if (sessionsData.length === 0 && conversationsData.length === 0) {
        console.log('没有找到任何对话，创建默认对话');
        try {
          // 显示骨架加载效果
          setIsLoadingMessages(true);
          
          const defaultSession = await ChatAPI.createSession({ title: '欢迎使用AI助手' });
          setCurrentSession(defaultSession);
          setChatMessages([]);
          await loadSessions();
          await loadConversations(); // 同时更新对话列表
          console.log('默认对话创建成功:', defaultSession.id);
        } catch (error) {
          console.error('创建默认对话失败:', error);
        } finally {
          // 隐藏骨架加载效果
          setIsLoadingMessages(false);
        }
      }
      
      // 设置网络监听
      setupNetworkListener();
      
      // 建立WebSocket连接
      setupWebSocket();
      
      // 如果网络连接正常且有待发送消息，尝试重发
      if (isNetworkConnected && storedPendingMessages.length > 0) {
        setTimeout(() => {
          retryPendingMessages();
        }, 2000); // 延迟2秒后开始重试
      }
    };
    
    initializeApp();
    
    // 初始化网络状态检测
    checkNetworkStatus();
    const unsubscribe = setupNetworkListener();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 轮播通知效果
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNoticeIndex((prevIndex) =>
        prevIndex === notices.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 每3秒切换一次

    return () => clearInterval(interval);
  }, [notices.length]);

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isPending = message.status === 'pending';
    const isFailed = message.status === 'failed';

    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>⚙️</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {message.content && (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
              {message.content}
            </Text>
          )}
          {message.image && (
            <View style={styles.messageImageContainer}>
              <Image
                source={{ uri: message.image.uri }}
                style={styles.messageImage}
                resizeMode="cover"
              />
              <Text style={styles.messageImageText}>
                {message.image.fileName || '图片'}
              </Text>
            </View>
          )}
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </Text>
            {isPending && (
              <View style={styles.messageStatus}>
                <Icon name="error" size={16} color="#ff4444" />
                <Text style={styles.pendingText}>待发送</Text>
              </View>
            )}
            {isFailed && (
              <View style={styles.messageStatus}>
                <Icon name="error" size={16} color="#ff4444" />
                <Text style={styles.failedText}>发送失败</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => retryFailedMessage(message)}
                >
                  <Icon name="refresh" size={12} color="#4a90e2" />
                  <Text style={styles.retryText}>重试</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 网络状态提示 */}
      {showNetworkAlert && (
        <View style={[
          styles.networkAlert,
          isNetworkConnected ? styles.networkAlertSuccess : styles.networkAlertError
        ]}>
          <Icon 
            name={isNetworkConnected ? "wifi" : "wifi-off"} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.networkAlertText}>
            {isNetworkConnected ? '网络连接已恢复' : '网络连接已断开'}
          </Text>
        </View>
      )}

      {/* 抽屉 */}
      {isDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity
            style={styles.drawerBackdrop}
            onPress={toggleDrawer}
            activeOpacity={1}
          />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>对话</Text>
              <View style={styles.drawerHeaderIcons}>
                <TouchableOpacity style={styles.drawerHeaderIcon}>
                  <Icon name="search" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawerHeaderIcon}>
                  <Icon name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={styles.drawerContent}>
              {/* 新建对话按钮 */}
              <TouchableOpacity style={styles.drawerItem} onPress={createNewSession}>
                <View style={styles.drawerItemLeft}>
                  <View style={[styles.drawerIcon, { backgroundColor: '#4a90e2' }]}>
                    <Text style={[styles.drawerIconText, { color: '#fff' }]}>+</Text>
                  </View>
                </View>
                <View style={styles.drawerItemRight}>
                  <Text style={styles.drawerItemTitle}>新建对话</Text>
                  <Text style={styles.drawerItemDesc}>开始新的聊天</Text>
                </View>
              </TouchableOpacity>

              {/* 连接状态指示器 */}
              <View style={styles.drawerItem}>
                <View style={styles.drawerItemLeft}>
                  <View style={[styles.drawerIcon, { backgroundColor: isConnected ? '#4caf50' : '#f44336' }]}>
                    <Text style={[styles.drawerIconText, { color: '#fff' }]}>
                      {isConnected ? '✓' : '✗'}
                    </Text>
                  </View>
                </View>
                <View style={styles.drawerItemRight}>
                  <Text style={styles.drawerItemTitle}>服务器状态</Text>
                  <Text style={styles.drawerItemDesc}>
                    {isConnected ? '已连接' : '未连接'}
                  </Text>
                </View>
              </View>

              {/* 刷新按钮 */}
              <TouchableOpacity 
                style={styles.drawerItem} 
                onPress={handleRefresh}
                disabled={isRefreshing}
              >
                <View style={styles.drawerItemLeft}>
                  <View style={[styles.drawerIcon, { backgroundColor: isRefreshing ? '#e9ecef' : '#4a90e2' }]}>
                    <Text style={[styles.drawerIconText, { color: '#fff' }]}>
                      {isRefreshing ? '⏳' : '🔄'}
                    </Text>
                  </View>
                </View>
                <View style={styles.drawerItemRight}>
                  <Text style={styles.drawerItemTitle}>
                    {isRefreshing ? '刷新中...' : '刷新数据'}
                  </Text>
                  <Text style={styles.drawerItemDesc}>
                    {isRefreshing ? '正在更新页面数据' : '重新加载所有数据'}
                  </Text>
                </View>
              </TouchableOpacity>


              {/* 对话列表标题 */}
              {conversations.length > 0 && (
                <View style={styles.drawerSectionHeader}>
                  <Text style={styles.drawerSectionTitle}>对话列表</Text>
                </View>
              )}

                             {/* 对话列表 */}
               {conversations.map((conversation) => (
                 <View 
                   key={conversation.id} 
                   style={[
                     styles.drawerItem,
                     currentSession?.id === conversation.id && styles.drawerItemActive
                   ]}
                 >
                   <TouchableOpacity 
                     style={styles.drawerItemContent}
                     onPress={() => {
                       setCurrentSession({
                         id: conversation.id,
                         title: conversation.title,
                         created_at: conversation.created_at,
                         updated_at: conversation.updated_at,
                         message_count: conversation.message_count
                       });
                       loadSessionMessages(conversation.id);
                       setIsDrawerOpen(false);
                     }}
                     onLongPress={() => handleDeleteSession(conversation.id, conversation.title)}
                   >
                     <View style={styles.drawerItemLeft}>
                       <View style={[styles.drawerIcon, { backgroundColor: '#fff3e0' }]}>
                         <Text style={styles.drawerIconText}>
                           {conversation.is_pinned ? '📌' : '📋'}
                         </Text>
                       </View>
                     </View>
                     <View style={styles.drawerItemRight}>
                       <Text style={[
                         styles.drawerItemTitle,
                         conversation.is_pinned && styles.pinnedTitle
                       ]}>
                         {conversation.title}
                       </Text>
                       <Text style={styles.drawerItemDesc}>
                         {conversation.preview} • {conversation.message_count} 条消息
                       </Text>
                     </View>
                   </TouchableOpacity>
                   
                   {/* 操作按钮组 */}
                   <View style={styles.actionButtons}>
                     {/* 置顶/取消置顶按钮 */}
                     <TouchableOpacity 
                       style={[styles.actionButton, conversation.is_pinned && styles.actionButtonActive]}
                       onPress={() => handleTogglePinSession(conversation.id, conversation.title, !conversation.is_pinned)}
                     >
                       <Icon 
                         name={conversation.is_pinned ? "push-pin" : "push-pin-outline"} 
                         size={16} 
                         color={conversation.is_pinned ? "#4a90e2" : "#666"} 
                       />
                     </TouchableOpacity>
                     
                     {/* 编辑按钮 */}
                     <TouchableOpacity 
                       style={styles.actionButton}
                       onPress={() => handleEditSessionTitle(conversation.id, conversation.title)}
                     >
                       <Icon name="edit" size={16} color="#666" />
                     </TouchableOpacity>
                     
                     {/* 删除按钮 */}
                     <TouchableOpacity 
                       style={styles.actionButton}
                       onPress={() => handleDeleteSession(conversation.id, conversation.title)}
                     >
                       <Icon name="delete" size={16} color="#f44336" />
                     </TouchableOpacity>
                   </View>
                 </View>
               ))}

              {sessions.length === 0 && !isLoading && (
                <View style={styles.drawerItem}>
                  <View style={styles.drawerItemLeft}>
                    <View style={[styles.drawerIcon, { backgroundColor: '#f5f5f5' }]}>
                      <Text style={styles.drawerIconText}>📝</Text>
                    </View>
                  </View>
                  <View style={styles.drawerItemRight}>
                    <Text style={styles.drawerItemTitle}>暂无对话</Text>
                    <Text style={styles.drawerItemDesc}>点击"新建对话"开始聊天</Text>
                  </View>
                </View>
              )}

              {isLoading && (
                <View style={styles.drawerItem}>
                  <View style={styles.drawerItemLeft}>
                    <View style={[styles.drawerIcon, { backgroundColor: '#f5f5f5' }]}>
                      <Text style={styles.drawerIconText}>⏳</Text>
                    </View>
                  </View>
                  <View style={styles.drawerItemRight}>
                    <Text style={styles.drawerItemTitle}>加载中...</Text>
                    <Text style={styles.drawerItemDesc}>正在获取对话列表</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 头部 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerIcon} onPress={toggleDrawer}>
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.speakerIcon}>
            <Icon name="volume-up" size={20} color="#4a90e2" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{notices[currentNoticeIndex]}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* 待发送消息指示器 */}
          {pendingMessages.length > 0 && (
            <View style={styles.pendingIndicator}>
              <Icon name="schedule" size={14} color="#ff9800" />
              <Text style={styles.pendingCount}>{pendingMessages.length}</Text>
            </View>
          )}
          
          {/* 网络状态指示器 */}
          <View style={[
            styles.networkIndicator,
            { backgroundColor: isNetworkConnected ? '#4caf50' : '#f44336' }
          ]}>
            <Icon 
              name={isNetworkConnected ? "wifi" : "wifi-off"} 
              size={14} 
              color="#fff" 
            />
          </View>
          
          {/* 刷新按钮 */}
          <TouchableOpacity 
            style={[styles.refreshButton, isRefreshing && styles.refreshButtonActive]} 
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Animated.View
              style={{
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }}
            >
              <Icon 
                name="refresh" 
                size={16} 
                color={isRefreshing ? "#999" : "#4a90e2"} 
              />
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.iconText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 聊天区域 */}
      <ScrollView 
        style={styles.chatContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4a90e2']}
            tintColor="#4a90e2"
            title="下拉刷新"
            titleColor="#4a90e2"
          />
        }
      >
        {/* 小助手欢迎区域 */}
        <View style={styles.assistantSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>⚙️</Text>
            </View>
            <Text style={styles.assistantName}>小助手</Text>
          </View>

          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>猜您想问:</Text>
            <View style={styles.flowContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionTag}
                  onPress={() => handleSuggestionClick(suggestion)}
                >
                  <Text style={styles.suggestionTagText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 聊天消息列表 */}
        {isLoadingMessages ? (
          <SkeletonMessages />
        ) : chatMessages.length > 0 ? (
          <View style={styles.messagesContainer}>
            {chatMessages.map(renderMessage)}
          </View>
        ) : null}

        {/* 中间按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.modelButton}>
            <Text style={styles.modelButtonText}>GPT-5.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.coinButton}>
            <Text style={styles.coinButtonText}>获得问答币</Text>
          </TouchableOpacity>
        </View>

        {/* 显示选中的图片 */}
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.selectedImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeSelectedImage}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.imageInfo}>
              <Text style={styles.imageInfoText}>
                {selectedImage.fileName || '图片'}
                {selectedImage.fileSize && ` (${Math.round(selectedImage.fileSize / 1024)}KB)`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 输入区域 */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputIcon} onPress={handleImageUpload}>
          <Text style={styles.iconText}>🖼️</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="请输入您的问题"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={handleInputChange}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 16,
    paddingVertical: isTablet ? 16 : 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  refreshButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  refreshButtonActive: {
    backgroundColor: '#e9ecef',
    transform: [{ rotate: '360deg' }],
  },
  pendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  pendingCount: {
    fontSize: 10,
    color: '#ff9800',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  headerIcon: {
    marginRight: isTablet ? 16 : 12,
    width: isTablet ? 32 : 24,
    height: isTablet ? 32 : 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: isTablet ? 24 : 18,
    color: '#333',
  },
  headerText: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: isTablet ? 32 : 16,
    maxWidth: isLargeTablet ? 800 : '100%',
    alignSelf: isLargeTablet ? 'center' : 'stretch',
  },
  assistantSection: {
    marginTop: isTablet ? 32 : 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  avatar: {
    width: isTablet ? 56 : 40,
    height: isTablet ? 56 : 40,
    borderRadius: isTablet ? 28 : 20,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 12 : 8,
  },
  avatarText: {
    fontSize: isTablet ? 28 : 20,
    color: '#fff',
  },
  assistantName: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '600',
    color: '#333',
  },
  suggestionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 16,
    marginLeft: isTablet ? 68 : 48,
  },
  suggestionTitle: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    marginBottom: isTablet ? 16 : 12,
  },
  flowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  suggestionTag: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 20 : 16,
    marginRight: isTablet ? 12 : 8,
    marginBottom: isTablet ? 12 : 8,
  },
  suggestionTagText: {
    fontSize: isTablet ? 14 : 12,
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isTablet ? 40 : 30,
    marginBottom: isTablet ? 30 : 20,
  },
  modelButton: {
    flex: 1,
    backgroundColor: '#4a90e2',
    borderRadius: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 16 : 12,
    marginRight: isTablet ? 12 : 8,
    alignItems: 'center',
  },
  modelButtonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  coinButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    borderRadius: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 16 : 12,
    marginLeft: isTablet ? 12 : 8,
    alignItems: 'center',
  },
  coinButtonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 16,
    paddingVertical: isTablet ? 16 : 12,
    paddingBottom: isTablet ? 80 : 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputIcon: {
    marginRight: isTablet ? 16 : 12,
    width: isTablet ? 32 : 24,
    height: isTablet ? 32 : 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: isTablet ? 48 : 40,
    backgroundColor: '#f8f9fa',
    borderRadius: isTablet ? 24 : 20,
    paddingHorizontal: isTablet ? 20 : 16,
    fontSize: isTablet ? 16 : 14,
    color: '#333',
  },
  sendButton: {
    marginLeft: isTablet ? 16 : 12,
    backgroundColor: '#4a90e2',
    borderRadius: isTablet ? 24 : 20,
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 12 : 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  selectedImageContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  imageInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  imageInfoText: {
    fontSize: 12,
    color: '#666',
  },
     messageContainer: {
     marginBottom: isTablet ? 20 : 15,
     flexDirection: 'row',
     alignItems: 'flex-start',
   },
   userMessage: {
     alignSelf: 'flex-end',
     flexDirection: 'row-reverse',
   },
   aiMessage: {
     alignSelf: 'flex-start',
     flexDirection: 'row',
   },
   aiAvatar: {
     width: isTablet ? 40 : 32,
     height: isTablet ? 40 : 32,
     borderRadius: isTablet ? 20 : 16,
     backgroundColor: '#4a90e2',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: isTablet ? 12 : 8,
     marginTop: isTablet ? 6 : 4,
   },
       aiAvatarText: {
      fontSize: isTablet ? 20 : 16,
      color: '#fff',
    },
     messageBubble: {
     maxWidth: isTablet ? '60%' : '70%',
     padding: isTablet ? 16 : 12,
     borderRadius: isTablet ? 20 : 15,
     backgroundColor: '#e0e0e0',
   },
  userBubble: {
    backgroundColor: '#4a90e2',
  },
  aiBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  messageImageContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  messageImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  messageImageText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  messageTime: {
    marginTop: 8,
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 10,
    color: '#ff4444',
    marginLeft: 4,
  },
  failedText: {
    fontSize: 10,
    color: '#ff4444',
    marginLeft: 4,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  retryText: {
    fontSize: 10,
    color: '#4a90e2',
    marginLeft: 2,
  },
  messagesContainer: {
    flex: 1,
    marginTop: 20,
  },
  // 小喇叭样式
  speakerIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 抽屉样式
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
     drawer: {
     position: 'absolute',
     top: 0,
     left: 0,
     width: '100%',
     height: '100%',
     backgroundColor: '#fff',
     shadowColor: '#000',
     shadowOffset: {
       width: 2,
       height: 0,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
   },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  drawerHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerHeaderIcon: {
    marginLeft: 15,
    padding: 5,
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  drawerItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
     deleteButton: {
     padding: 8,
     marginLeft: 8,
     borderRadius: 4,
     backgroundColor: '#fff5f5',
     borderWidth: 1,
     borderColor: '#ffebee',
   },
   actionButtons: {
     flexDirection: 'row',
     alignItems: 'center',
     marginLeft: 8,
   },
   actionButton: {
     padding: 6,
     marginLeft: 4,
     borderRadius: 4,
     backgroundColor: '#f8f9fa',
     borderWidth: 1,
     borderColor: '#e9ecef',
   },
   actionButtonActive: {
     backgroundColor: '#e3f2fd',
     borderColor: '#4a90e2',
   },
   pinnedTitle: {
     fontWeight: 'bold',
     color: '#4a90e2',
   },
  drawerItemLeft: {
    marginRight: 15,
  },
  drawerItemRight: {
    flex: 1,
  },
  drawerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerAvatarText: {
    fontSize: 20,
  },
  drawerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIconText: {
    fontSize: 16,
    color: '#666',
  },
  drawerItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  drawerItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  drawerItemTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  drawerItemTagText: {
    fontSize: 12,
    color: '#1976d2',
  },
  drawerItemDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  drawerItemActive: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 3,
    borderLeftColor: '#4a90e2',
  },
  drawerSectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  drawerSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // 网络状态提示样式
  networkAlert: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  networkAlertSuccess: {
    backgroundColor: '#4caf50',
  },
  networkAlertError: {
    backgroundColor: '#f44336',
  },
  networkAlertText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  // 骨架加载样式
  skeletonAvatar: {
    width: isTablet ? 40 : 32,
    height: isTablet ? 40 : 32,
    borderRadius: isTablet ? 20 : 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  skeletonText: {
    width: '100%',
    height: isTablet ? 16 : 14,
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: isTablet ? 8 : 6,
    marginBottom: isTablet ? 8 : 6,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.15)',
  },
  skeletonTime: {
    width: '40%',
    height: isTablet ? 14 : 12,
    backgroundColor: 'rgba(74, 144, 226, 0.06)',
    borderRadius: isTablet ? 7 : 6,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.12)',
  },
  loadingIndicatorContainer: {
    alignItems: 'center',
    marginTop: isTablet ? 30 : 20,
    marginBottom: isTablet ? 30 : 20,
    paddingVertical: isTablet ? 20 : 15,
    paddingHorizontal: isTablet ? 30 : 20,
    backgroundColor: 'rgba(74, 144, 226, 0.03)',
    borderRadius: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  loadingIndicator: {
    transform: [{ rotate: '0deg' }],
  },
  loadingText: {
    marginTop: isTablet ? 12 : 10,
    fontSize: isTablet ? 16 : 14,
    color: 'rgba(74, 144, 226, 0.7)',
    fontWeight: '500',
  },
});
