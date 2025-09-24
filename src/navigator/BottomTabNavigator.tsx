import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@screens/home';
import { BoardListScreen } from '@screens/board';
import { ProfileScreen } from '@screens/profile';
import { Header } from '../components';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // 바텀 탭 안보여줄 화면들
  const hideOnScreens = ['ProfileEdit'];

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route)
        const tabBarStyle = { display: 'flex' as 'flex' | 'none' };
        if(routeName && hideOnScreens.includes(routeName)) {
          tabBarStyle.display = 'none';
        }
        return {
          header: (props) => <Header headerProps={props} />,
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
        }}
      />
    </BottomTab.Navigator>
  )
}

export default BottomTabNavigator;