import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BoardActionList } from '@screens/message/components';
import { ProfileMyBoard } from '@screens/profile/components';

const ProfileActionTab = createMaterialTopTabNavigator();

const ProfileActionNavigator = () => {
  return (
    <ProfileActionTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#6A49E9' },
        tabBarActiveTintColor: '#6A49E9',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: 'white' },
      }}
    >
      <ProfileActionTab.Screen
        name="ProfileMyBoard"
        component={ProfileMyBoard}
        options={{ tabBarLabel: '게시물' }}
      />
      {/*<ProfileActionTab.Screen*/}
      {/*  name="ProfileMyComments"*/}
      {/*  component={View}*/}
      {/*  options={{ tabBarLabel: '댓글' }}*/}
      {/*/>*/}
      <ProfileActionTab.Screen
        name="ProfileViewHistory"
        options={{ tabBarLabel: '조회 기록' }}
      >
        {() => <BoardActionList actionType={'view'} />}
      </ProfileActionTab.Screen>
    </ProfileActionTab.Navigator>
  );
}

export default ProfileActionNavigator;