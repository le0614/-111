import React from 'react'
import { View,  Text} from'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Hui from './src/pages/Hui';
import Show from './src/pages/Show';
import Gong from './src/pages/Gong';
import Mo from './src/pages/Mo';
import Wo from './src/pages/Wo';
const Tab=createBottomTabNavigator()
const Stack=createStackNavigator()

const Showw = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Show" component={Show} />
  </Stack.Navigator>
);
const Huii = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Hui" component={Hui} />

  </Stack.Navigator>
);

const Moo= () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Mo" component={Mo} />
  </Stack.Navigator>
);
const Woo = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Wo" component={Wo} />
  </Stack.Navigator>
);
const Gongg = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Gong" component={Gong} />
  </Stack.Navigator>
);
const MainTabs = () => (
  <>
    <Tab.Navigator
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          height: 45,
          backgroundColor: 'rgb(255, 255, 255)',
          elevation: 0,
          position: 'absolute',
          borderWidth:1,
          borderColor:'rgb(35, 4, 2)',
        },
        tabBarIcon: () => null,
        tabBarItemStyle: { marginTop: -20 },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarActiveTintColor:'rgb(13, 130, 209)',
        tabBarInactiveTintColor:'rgb(0, 0, 0)',
      }}
    >
      <Tab.Screen name="首页" component={Showw} />
      <Tab.Screen name="角色模型" component={Moo} />
      <Tab.Screen name="AI绘画" component={Huii} />
      <Tab.Screen name="工具" component={Gongg} />
      <Tab.Screen name="我的" component={Woo} />
    </Tab.Navigator>

 
  </>
);
export default function App() {

  return (
    <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, 
            presentation: 'card' 
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
       {/* 可以写新的页面前提要跟据上边这个写， */}
        </Stack.Navigator>
      </NavigationContainer>
  )
}
