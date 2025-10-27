import { createStackNavigator } from '@react-navigation/stack';
import { ProfileEditScreen } from '@screens/profile';
import { Header } from '@components';
import { BoardStep1Screen, BoardScreen, BoardStep2Screen } from '@screens/board';
import BottomTabNavigator from './BottomTabNavigator';

const AppStack = createStackNavigator();
const AppNavigator = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Main"
      screenOptions={{
        header: (props) => <Header {...props} />,
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
      />
    </AppStack.Navigator>
  )
}

export default AppNavigator;