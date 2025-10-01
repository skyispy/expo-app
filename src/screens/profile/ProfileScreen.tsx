import { Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLogoutUser } from '../../hooks';
import { useAuthStore } from '../../store';
import { ProfileBox } from './ProfileBox';

export const ProfileScreen = () => {
  const { logoutUser } = useLogoutUser();
  const { user } = useAuthStore((state) => state);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <ScrollView>
      {user && <ProfileBox user={user} />}
      <TouchableOpacity onPress={handleLogout}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
