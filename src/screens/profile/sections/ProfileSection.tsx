import { View, Text, StyleSheet } from 'react-native';
import { ProfileImage } from '@components';
import type { User } from '@types';
import { useAuthStore } from '@store';

export const ProfileSection = () => {
  const user = useAuthStore((state) => state.user) as User;
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ProfileImage size={80} uri={user.profileImageUrl} />
        <View style={styles.profileDetailsContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.nickname}>{user.nickname}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <View style={styles.introductionContainer}>
            <Text style={styles.introduction}>{user.introduction}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  profileImageContainer: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetailsContainer: {
    flex: 1,
    marginLeft: 24,
    justifyContent: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  introductionContainer: {
    marginTop: 4,
    maxWidth: '80%',
    padding: 6,
    backgroundColor: '#f0f0f0',
  },
  introduction: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
