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
}
