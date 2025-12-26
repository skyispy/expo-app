import { View } from 'react-native';
import { ProfileActionNavigator, ProfileSection } from './sections';

export const ProfileScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ProfileSection />
      <ProfileActionNavigator />
    </View>
  );
};