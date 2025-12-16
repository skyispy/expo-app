import { View } from 'react-native';
import { ProfileSection } from './sections';
import ProfileActionNavigator from '../../navigator/ProfileActionNavigator';

export const ProfileScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ProfileSection />
      <ProfileActionNavigator />
    </View>
  );
};