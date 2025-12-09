import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@screens/home';
import { BoardListScreen } from '@screens/board';
import { ProfileScreen } from '@screens/profile';
import { Header } from '@components';
import { AppStackScreenProps } from '@types';
import { Pressable } from 'react-native';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { MessageScreen } from '@screens/message';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // 바텀 탭 안보여줄 화면들
  const hideOnScreens = ['ProfileEdit'];
  const navigation = useNavigation<AppStackScreenProps>();

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route)
        const tabBarStyle = { display: 'flex' as 'flex' | 'none' };
        if(routeName && hideOnScreens.includes(routeName)) {
          tabBarStyle.display = 'none';
        }
        return {
          header: (props: BottomTabHeaderProps) => <Header {...props} />,
          tabBarStyle,
        }
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="home" size={size} color={color} />,
          tabBarLabel: '홈',
          tabBarActiveTintColor: '#6A49E9',
          tabBarInactiveTintColor: 'gray',
          headerTitle: '홈',
        }}
      />
      <BottomTab.Screen
        name="BoardList"
        component={BoardListScreen}
        options={{
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="musical-note" size={size} color={color} />,
          tabBarLabel: '게시판',
          tabBarActiveTintColor: '#6A49E9',
          tabBarInactiveTintColor: 'gray',
          headerTitle: '게시판',
        }}
      />
      <BottomTab.Screen
        name="BoardModal"
        options={{
          tabBarButton: () => (
            <Pressable
              onPress={() => navigation.navigate({ name: 'BoardStep1', params: {} })}
              style={{ alignItems: 'center', justifyContent: 'center', marginTop: -16 }}
            >
              <Ionicons
                name="add-circle"
                size={64}
                color="#6A49E9"
              />
            </Pressable>
          ),
          tabBarLabel: '',
        }}
      >
        {() => null}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="Message"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="mail" size={size} color={color} />,
          tabBarLabel: '메세지',
          tabBarActiveTintColor: '#6A49E9',
          tabBarInactiveTintColor: 'gray',
          headerTitle: '메세지',
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="person" size={size} color={color} />,
          tabBarLabel: '프로필',
          tabBarActiveTintColor: '#6A49E9',
          tabBarInactiveTintColor: 'gray',
          headerTitle: '프로필',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Settings")}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </Pressable>
          )
        }}
      />
    </BottomTab.Navigator>
  )
}

export default BottomTabNavigator;