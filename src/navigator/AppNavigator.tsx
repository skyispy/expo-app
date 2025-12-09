import { createStackNavigator } from '@react-navigation/stack';
import { Header } from '@components';
import BottomTabNavigator from './BottomTabNavigator';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '@types';
import { BoardScreen, BoardStep1Screen, BoardStep2Screen } from '@screens/board';
import { ProfileEditScreen, BoardActionScreen } from '@screens/profile';
import { SettingScreen } from '@screens/settings';

const AppStack = createStackNavigator();
const AppNavigator = () => {
  const navigation = useNavigation<AppStackScreenProps>();

  return (
    <AppStack.Navigator
      initialRouteName="Main"
      screenOptions={{
        header: (props) => <Header {...props} />,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Pressable
              style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          ) : null,
      }}
    >
      <AppStack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Board"
        component={BoardScreen}
        options={{
          headerTitle: '게시글',
          animation: 'scale_from_center'
        }}
      />
      <AppStack.Screen
        name="BoardStep1"
        component={BoardStep1Screen}
      />
      <AppStack.Screen
        name={"BoardStep2"}
        component={BoardStep2Screen}
      />
      <AppStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ headerTitle: '프로필 수정' }}
      />
      <AppStack.Screen
        name="BoardAction"
        component={BoardActionScreen}
      />
      <AppStack.Screen
        name={"Settings"}
        component={SettingScreen}
        options={{ headerTitle: '설정' }}
      />
    </AppStack.Navigator>
  )
}

export default AppNavigator;