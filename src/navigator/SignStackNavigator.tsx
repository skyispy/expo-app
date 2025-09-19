import { createStackNavigator } from '@react-navigation/stack';
import { Header } from '../components';
import { LoginScreen, SignupScreen } from '@screens/sign';

// 로그인, 회원가입
const SignStack = createStackNavigator();
const SignStackNavigator = () => {
  return (
    <SignStack.Navigator
      screenOptions={{
        header: (props) => <Header headerProps={props} />,
      }}
    >
      <SignStack.Screen name="Login" component={LoginScreen} />
      <SignStack.Screen name="Signup" component={SignupScreen} />
    </SignStack.Navigator>
  );
};

export default SignStackNavigator;