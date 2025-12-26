import { createStackNavigator } from '@react-navigation/stack';
import { Header } from '@components';
import { LoginScreen, SignupScreen } from '@screens/sign';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SignStackScreenProps } from '@types';

// 로그인, 회원가입
const SignStack = createStackNavigator();
const SignStackNavigator = () => {
  const navigation = useNavigation<SignStackScreenProps>();
  return (
    <SignStack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Pressable
              style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          ) : null,
      }}
    >
      <SignStack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '로그인' }} />
      <SignStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerTitle: '회원가입' }}
      />
    </SignStack.Navigator>
  );
};

export default SignStackNavigator;
