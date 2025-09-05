import { Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLogoutUser } from '../../hooks';
import { useAuthStore } from '../../store';
import { ProfileBox } from '@components/profile';
import { useNavigation } from '@react-navigation/native';
import type { ProfileStackScreenProps } from '../../types';

export const ProfileScreen = () => {
  const { logoutUser } = useLogoutUser();
  const { user, clearUser } = useAuthStore((state) => state);

  const navigation = useNavigation<ProfileStackScreenProps>();

  const handleLogout = async () => {
    const { message } = await logoutUser();
    Alert.alert('로그아웃', message);
    clearUser();
  };

  return (
    <ScrollView>
      {user && <ProfileBox user={user} navigation={navigation} />}
      <TouchableOpacity onPress={handleLogout}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
