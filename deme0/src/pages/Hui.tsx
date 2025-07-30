import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';

const tabs = ['文生图', '图生图', '美图广场'];

export default function Hui() {
  const [activeTab, setActiveTab] = useState(0);

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
              <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>

      {/* 内容区 */}
      <View style={{ flex: 1 }}>
        {activeTab === 0 && (
          <ScrollView contentContainerStyle={styles.content}>
            {/* 这里放文生图内容，比如输入框、风格选择、按钮等 */}
            <Text>文生图内容区</Text>
          </ScrollView>
        )}
        {activeTab === 1 && (
          <ScrollView contentContainerStyle={styles.content}>
            {/* 这里放图生图内容 */}
            <Text>图生图内容区</Text>
          </ScrollView>
        )}
        {activeTab === 2 && (
          <ScrollView contentContainerStyle={styles.content}>
            {/* 这里放美图广场内容，比如图片卡片列表 */}
            <Text>美图广场内容区</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    width: '100%',
    height: 180,
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
    padding: 16,
  },
});
