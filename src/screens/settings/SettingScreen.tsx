import { Pressable, ScrollView, Text, StyleSheet } from 'react-native';
import { SettingMenuSection } from '@screens/settings/sections';
import { useLogoutUser } from '@hooks';

export const SettingScreen = () => {
  const { logoutUser } = useLogoutUser();
  return (
    <ScrollView style={styles.container}>
      <SettingMenuSection />

      <Pressable style={styles.logoutButton} onPress={() => logoutUser()}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#6A49E9',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
