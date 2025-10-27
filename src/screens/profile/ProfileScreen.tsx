import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLogoutUser } from '@hooks';
import { ProfileBox } from './components/ProfileBox';

export const ProfileScreen = () => {

  const { logoutUser } = useLogoutUser();
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <ScrollView>
      <ProfileBox />
      <TouchableOpacity onPress={handleLogout}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
