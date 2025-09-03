import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/home';
import { ProfileScreen } from './screens/profile';
import { Header } from './components/common';
import { SignupScreen, LoginScreen } from './screens/sign';
import { useAuthStore } from './store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useTokenLoginUser } from './hooks';
import { useEffect, useState } from 'react';

// 로그인, 회원가입
const SignStack = createStackNavigator();
const SignStackScreen = () => {
  return (
    <SignStack.Navigator screenOptions={{
      header: (props) => <Header headerProps={props} />,
    }}>
      <SignStack.Screen name="Login" component={LoginScreen} />
      <SignStack.Screen name="Signup" component={SignupScreen} />
    </SignStack.Navigator>
  );
};

// 홈
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{
      header: (props) => <Header headerProps={props} />,
    }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
  </HomeStack.Navigator>
);

// 프로필
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{
      header: (props) => <Header headerProps={props} />,
    }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const BottomTab = createBottomTabNavigator();
const Navigator = () => {
  const { user, setUser, clearUser } = useAuthStore((state) => state);
  const { tokenLoginUser, isTokenLoginPending } = useTokenLoginUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if(!user) {
      // 자동 로그인 시도
      tokenLoginUser(undefined, {
        onSuccess: (data) => {
          if(data?.user) {
            setUser(data.user);
          } else {
            clearUser();
          }
        },
        onError: () => clearUser()
      });
    }
  }, []);

  useEffect(() => {
    if (isTokenLoginPending) {
      setIsLoading(true);
    } else {
      // 토큰 검증이 끝나면 0.5초 후에 로딩 해제
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTokenLoginPending]);

  // 로딩 화면
  if(isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <BottomTab.Navigator screenOptions={{
          headerShown: false,
          tabBarStyle: { borderWidth: 1, marginTop: 5 },
        }}>
          <BottomTab.Screen name="HomeTab" component={HomeStackScreen} options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarLabel: '홈',
            tabBarActiveTintColor: '#6A49E9',
            tabBarInactiveTintColor: 'gray',
          }} />
          <BottomTab.Screen name="ProfileTab" component={ProfileStackScreen} options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarLabel: '프로필',
            tabBarActiveTintColor: '#6A49E9',
            tabBarInactiveTintColor: 'gray',
          }} />
        </BottomTab.Navigator>
      ) : (
        <SignStackScreen />
      )}
    </NavigationContainer>
  );
};

export default Navigator;
