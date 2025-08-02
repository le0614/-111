import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import axios, { AxiosError } from 'axios';
const tabs = ['文生图', '图生图', '美图广场'];
export default function Hui() {
  const [zhi,setzhi]=useState<string>('');
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [text, setText] = useState<string>('');
  const pickImage = (): void => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true,
    };
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('Image picker response:', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Error code:', response.errorCode);
        console.log('Error message:', response.errorMessage);
        if (Platform.OS === 'android') {
          // 在Android上使用Toast或其他方式显示错误
          console.log('选择图片时出现错误');
        } else {
          Alert.alert('错误', '选择图片时出现错误');
        }
      } else if (response.assets && response.assets[0]) {
        console.log('Selected image:', response.assets[0]);
        setSelectedImage(response.assets[0]);
      }
    });
  };
  const removeImage = (): void => {
    setSelectedImage(null);
  };
  // 定义生成图片的函数
  const [pan, setpan] = useState<string>(''); // 设置默认风格
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textGeneratedImageUrl, setTextGeneratedImageUrl] = useState<
    string | null
  >(null); // 文生图结果
  const [imageGeneratedImageUrl, setImageGeneratedImageUrl] = useState<
    string | null
  >(null); // 图生图结果
  const [type, settype] = useState<string[]>([
    '二次元',
    '科幻',
    '自然',
    '卡通',
    '建筑',
  ]);
  const generateImage = async (): Promise<void> => {
    const token = 'sk-ykohumliuxiqsioulldxwjdiguapkznqtazfhytdsvvmeaaq';
    try {
      // 生成新图片前先清除旧图片并显示加载状态
      setTextGeneratedImageUrl(null);
      setIsLoading(true);
      console.log('函数被调用，开始请求API...');
      const response = await axios.post(
        'https://api.siliconflow.cn/v1/images/generations',
        {
          model: 'Kwai-Kolors/Kolors',
          prompt: `${text}，风格：${pan}`,
          style: pan,
          image_size: '1024x1024',
          batch_size: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // 修复：使用response.data而不是response.json()
      console.log('API响应状态码：', response.status);
      const result = response.data; // 直接使用response.data
      console.log('API返回结果：', result); // 打印完整结果，看是否有错误信息

      if (
        response.status === 200 &&
        result.images &&
        result.images.length > 0
      ) {
        const imageUrl = result.images[0].url;
        setTextGeneratedImageUrl(imageUrl);
        console.log('生成成功，图片URL：', imageUrl);
        // 确保在状态更新后再保存数据
        // 直接使用API返回的imageUrl，不依赖状态更新
        saveData(text, imageUrl);
      } else {
        // 修复：确保在所有平台上正确显示错误
        const errorMsg = `错误信息：${
          result.error?.message || result.error || '未知错误'
        }`;
        console.log('生成失败:', errorMsg);
        if (Platform.OS === 'android') {
          console.log(errorMsg);
          // 可以考虑使用react-native-toast-message等库来在Android上显示提示
        } else {
          Alert.alert('生成失败', errorMsg);
        }
      }
    } catch (error) {
      console.error('API调用异常：', error); // 打印网络错误详情
      const axiosError = error as AxiosError;
      const errorMsg = `异常信息：${axiosError.message}`;
      if (Platform.OS === 'android') {
        console.log(errorMsg);
      } else {
        Alert.alert('网络错误', errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
    setText('')
  };

const saveData = async (i: string, t: string) => {
  try {
    // 验证图片URL
    if (!t || t.trim() === '') {
      console.warn('保存数据时图片URL为空');
      Alert.alert('提示', '图片URL为空，无法保存');
      return;
    }
    
    // 获取已有的数据
    const existingData = await AsyncStorage.getItem('userData');
    // 如果有数据则解析为数组，否则创建空数组
    const dataArray = existingData ? JSON.parse(existingData) : [];
    // 确保是数组类型
    const validDataArray = Array.isArray(dataArray) ? dataArray : [];
    // 添加新数据
    validDataArray.push({ name: i, img: t });
    // 存储更新后的数据
    const jsonValue = JSON.stringify(validDataArray);
    await AsyncStorage.setItem('userData', jsonValue);
    console.log('数据存储成功:', { name: i, img: t });
    
    // 存储成功后刷新数据
    refreshData();
  } catch (error) {
    console.error('存储数据时出错:', error);
  }
};
  const generateImageFromImage = async (): Promise<void> => {
    setIsImageGenerating(true);
    const token = 'sk-ykohumliuxiqsioulldxwjdiguapkznqtazfhytdsvvmeaaq';
    if (!selectedImage) {
      Alert.alert('提示', '请先上传参考图片');
      return;
    }

    try {
      setIsLoading(true);
      console.log('开始图生图 API 请求...');

      // 将本地图片转换为base64
      const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`;
      console.log('图片base64长度:', base64Image.length); // 添加日志

      // 检查token有效性
      if (!token || token.length === 0) {
        throw new Error('API密钥不能为空');
      }

      // 检查prompt
      if (!zhi || zhi.length === 0) {
        throw new Error('请输入提示词');
      }

      console.log('请求参数:', {
        model: 'Kwai-Kolors/Kolors',
        prompt: text,
        image_size: '1024x1024',
        batch_size: 1,
        num_inference_steps: 20,
        guidance_scale: 7.5,
      });

      const response = await axios.post(
        'https://api.siliconflow.cn/v1/images/generations',
        {
          model: 'Kwai-Kolors/Kolors',
          prompt: `${text} ${zhi}`,
          style: zhi,
          image: base64Image,
          strength: 0.95 , // 控制原图影响程度，0-1之间，值越大越接近原图
          image_size: '1024x1024',
          batch_size: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          validateStatus: status => {
            return status >= 200 && status < 300; // 只接受2xx状态码
          },
          timeout: 30000, // 设置30秒超时
        },
      );

      console.log('图生图 API 响应状态码：', response.status);
      console.log(
        '图生图 API 响应数据：',
        JSON.stringify(response.data).substring(0, 500),
      ); // 只打印前500个字符
      const result = response.data;

      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url;
        setImageGeneratedImageUrl(imageUrl);
      console.log('图生图成功，图片URL：', imageUrl);
      // 确保在状态更新后再保存数据
      // 直接使用API返回的imageUrl，不依赖状态更新
      saveData(zhi, imageUrl);
      setIsImageGenerating(false);
      } else {
        const errorMsg = `错误信息：${
          result.error?.message || result.error || '未知错误'
        }`;
        console.log('图生图生成失败:', errorMsg);
        Alert.alert('生成失败', errorMsg);
      }
    } catch (error) {
      console.error('图生图 API 调用异常：', error);
      // 详细的错误信息
      let errorMessage = '网络错误';
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // 服务器返回了错误响应
        errorMessage = `服务器错误: ${axiosError.response.status} ${
          axiosError.response.statusText
        }\n${JSON.stringify(axiosError.response.data)}`;
      } else if (axiosError.request) {
        // 请求已发送但未收到响应
        errorMessage = '请求超时或服务器无响应';
      } else {
        // 设置请求时发生错误
        errorMessage = `请求错误: ${axiosError.message}`;
      }
      console.log('详细错误信息:', errorMessage);
      Alert.alert('图生图失败', errorMessage);
    } finally {
      setIsLoading(false);
    }
    setzhi('')
  };


  // 读取数据
  const [data, setdata] = useState<Object[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue) {
          const parsedData = JSON.parse(jsonValue);
          console.log('获取到的数据:', parsedData); // 日志记录获取到的数据
          setdata(parsedData);
        } else {
          console.log('没有找到存储的数据');
        }
      } catch (error) {
        console.error('读取数据时出错:', error);
      }
    };

    fetchData();
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  // 添加刷新数据的函数，方便测试
  const refreshData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      if (jsonValue) {
        const parsedData = JSON.parse(jsonValue);
        setdata(parsedData);
        console.log('手动刷新数据成功');
      }
    } catch (error) {
      console.error('刷新数据时出错:', error);
    }
  };
 


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 顶部背景和标题 */}
      <ImageBackground
        source={require('../assets/images/beijing.png')} // 换成你的背景图
        style={styles.headerBg}
        resizeMode="cover"
      >
        <Text style={styles.title}>AI绘画</Text>
        <Text style={styles.subtitle}>以我为笔，画您所思，画您所画。</Text>
        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === idx && styles.tabBtnActive]}
              onPress={() => setActiveTab(idx)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === idx && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>

      {/* 图片显示区域 */}

      {/* 内容区 */}
      <View style={{ flex: 1 }}>
        {activeTab === 0 && (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.inp}>
              <View>
                <TextInput
                  placeholder="请输入当前想看的效果"
                  multiline={true}
                  numberOfLines={4}
                  style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    height: 80,
                    width: '90%',
                    borderRadius: 10,
                    marginLeft: 15,
                    textAlignVertical: 'top',
                  }}
                  value={text}
                  onChangeText={setText}
                />
                <View style={{ marginLeft: 15, marginTop: 5 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>风格</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginLeft: 15,
                    marginTop: 5,
                    height: 50,
                    width: '90%',
              
                  }}
                >
                  {type.map((i, index) => {
                    return (
                      <View key={index} style={pan == i ? styles.q : styles.w}>
                        <Text
                          onPress={() => {
                            setpan(i);
                          }}
                        >
                          {i}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View style={{ padding: 10, alignItems: 'center' }}>
                {textGeneratedImageUrl && (
                  <Image
                    source={{ uri: textGeneratedImageUrl }}
                    style={{
                      width: '100%',
                      height: 300,
                      resizeMode: 'contain',
                    }}
                  />
                )}
                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>正在生成图片...</Text>
                  </View>
                )}
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 15,
              }}
            >
              {text === '' ? (
                <TouchableOpacity style={styles.button} onPress={generateImage}>
                  <Text style={styles.buttonText}>
                    随机绘制
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={generateImage}>
                  <Text style={styles.buttonText}>
                    开始绘制
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={async () => {
                  if (textGeneratedImageUrl) {
                    await Linking.openURL(textGeneratedImageUrl);
                  } else {
                    Alert.alert('提示', '没有可打开的图片URL');
                  }
                }}
                style={styles.button1}
              >
                <Text style={styles.button1Text}>
                  下载
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        {activeTab === 1 && (
          <ScrollView contentContainerStyle={styles.content}>
            {/* 这里放图生图内容 */}
            <Text style={styles.sectionTitle}>图生图</Text>
            <View style={styles.inp}>
              {imageGeneratedImageUrl ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageGeneratedImageUrl }}
                    style={styles.uploadedImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => setImageGeneratedImageUrl(null)}
                  >
                    <Text style={styles.removeBtnText}>重新上传</Text>
                  </TouchableOpacity>
                </View>
              ) : selectedImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.uploadedImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeImage}
                  >
                    <Text style={styles.removeBtnText}>删除</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                  <Text style={styles.uploadText}>点击上传图片</Text>
                  <Text style={styles.uploadHint}>支持 JPG、PNG 格式</Text>
                </TouchableOpacity>
              )}
              <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="请输入提示"
                style={{
                  borderColor: 'gray',
                  borderWidth: 1,
                  height: 40,
                  width: '60%',
                  borderRadius: 10,
                  fontSize: 15,
                  marginLeft: 15,
                }}
                value={zhi}
                onChangeText={setzhi}
              />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: 80,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 15,
              }}
            >
              {!imageGeneratedImageUrl && (
                <TouchableOpacity style={styles.button10} onPress={generateImageFromImage} disabled={isImageGenerating}>
                  <Text style={styles.button10Text}>
                    {isImageGenerating ? '生成中...' : '开始绘制'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={async () => {
                  if (imageGeneratedImageUrl) {
                    await Linking.openURL(imageGeneratedImageUrl);
                  } else {
                    Alert.alert('提示', '没有可打开的图片URL');
                  }
                }}
                style={styles.button11}
              >
                <Text style={styles.button11Text}>
                  下载
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        {activeTab === 2 && (
          <FlatList
            data={data}
            contentContainerStyle={styles.content}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const { name, img } = item as { name: string; img: string };
              console.log(`渲染图片 ${index}:`, img); // 添加日志以便调试
              return (
                <View style={{width: '45%', marginBottom: 10, marginHorizontal: '2.5%'}}>
                  <Text style={{marginBottom: 5}}>{name}</Text>
                  <View style={{backgroundColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden'}}>
                    {img ? (
                      <Image
                        source={{ uri: img }}
                        style={{ width: '100%', height: 150 }}
                        resizeMode="cover"
                        onError={(e) => console.log(`图片加载错误 ${index}:`, e.nativeEvent.error)}
                      />
                    ) : (
                      <View style={{width: '100%', height: 150, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>无图片</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <Text style={{marginTop: 20, textAlign: 'center', width: '100%'}}>暂无数据</Text>
            )}
            numColumns={2}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  q: {

    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginRight: 10,
    marginBottom: 10,
 
  
  },
  w: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
     marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  headerBg: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inp: {
    width: '100%',
    height: 335,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 4,
    marginBottom: -20,
  },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#666',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#0a84ff',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    paddingBottom: 100, // 增加底部 padding 防止被按钮遮挡
  },
  button: {
    backgroundColor: '#0a84ff',
    height: 40,
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
  },
  button1: {
    backgroundColor: 'white',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '30%',
  },
  button1Text: {
    color: 'black',
    textAlign: 'center',
    lineHeight: 40,
  },
  button10: {
    backgroundColor: '#0a84ff',
    height: 40,
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  button10Text: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
  },
  button11: {
    backgroundColor: 'white',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    width: '30%',
  },
  button11Text: {
    color: 'black',
    textAlign: 'center',
    lineHeight: 40,
  },


  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  uploadArea: {
    width: '100%',
    height: 130,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 5,
  },
  uploadHint: {
    color: '#999',
    fontSize: 12,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 16,

    fontWeight: 'bold',
  },
  loadingContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
});
