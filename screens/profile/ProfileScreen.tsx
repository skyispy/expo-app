import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLogoutUser } from '../../hooks';
import { useAuthStore } from '../../store/useAuthStore';

export const ProfileScreen = () => {
  const { logoutUser } = useLogoutUser();
  const clearUser = useAuthStore(state => state.clearUser);

  const handleLogout = async () => {
    const { message } = await logoutUser();
    Alert.alert('로그아웃', message);
    clearUser();
  }

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};
