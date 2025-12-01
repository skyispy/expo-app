import { Text, TouchableOpacity, ScrollView, View, StyleSheet } from 'react-native';
import { ProfileBox } from './components/ProfileBox';
import { ProfileActions } from '@screens/profile/components/ProfileActions';

export const ProfileScreen = () => {

  return (
    <ScrollView>
      <ProfileBox />
      <ProfileActions />
    </ScrollView>
  );
};