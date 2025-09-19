import { createStackNavigator } from '@react-navigation/stack';
import { ProfileEditScreen } from '@screens/profile';
import { Header } from '../components';
import { BoardScreen } from '@screens/board';
import BottomTabNavigator from './BottomTabNavigator';

const AppStack = createStackNavigator();
const AppNavigator = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Main"
      screenOptions={{
        header: (props) => <Header headerProps={props} />,
      }}
    >
      <AppStack.Screen
        name="Main"
        component={BottomTabNavigator}
      />
      <AppStack.Screen
        name="Board"
        component={BoardScreen}
      />
      <AppStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
      />
    </AppStack.Navigator>
  )
}

export default AppNavigator;