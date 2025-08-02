import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';

export default function RoleModelScreen({ navigation }:any) {
  // const navigation=useNavigation()
  const [modelData, setModelDate] = useState<any>([]);
  const [searchText, setSearchText] = useState<any>();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.222.89:3000/ss/getList`).then(res => {
      console.log(res.data.data);
      setModelDate(res.data.data);
      setFilteredData(res.data.data); // 初始化过滤数据
    });
  }, []);

  

  const handleSearch = () => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      setFilteredData(modelData);
      return;
    }
    const results = modelData.filter((item:any) =>
      item.name.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
    setFilteredData(results);
  };


  const renderModelCard = ({ item }:any) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      navigation.navigate('MainTabs', {
        screen: '首页',
        params: {
          screen: 'Show',
          params: { 
            item
          }
        }
      });
    }}>
      <Image source={{ uri: item.img }} style={styles.cardImage} />
      <View style={styles.cardTextWrapper}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardContent} numberOfLines={2}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="请输入角色模型"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.btnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      {filteredData.length === 0 ? (
        <Text style={styles.noResultsText}>暂时没有该模型，敬请期待</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderModelCard}
          keyExtractor={(item:any) => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
    padding: 16,
    marginBottom:30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingTop: 12,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  cardTextWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardContent: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    textAlign: 'center',
  },
  noResultsText:{
    textAlign:"center",
    fontSize:20,
    marginTop:20,
  }
});