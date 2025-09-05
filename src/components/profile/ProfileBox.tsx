import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { User } from '../../types';

export const ProfileBox = ({ user, navigation }: { user: User; navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={user.profileImageUrl ?? require('@assets/user.png')}
          />
        </View>
        <View style={styles.profileDetailsContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.nickname}>{user?.nickname}</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ProfileEdit')}
        >
          <Text style={styles.actionButtonText}>프로필 수정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>내 글 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileDetailsContainer: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  userInfoContainer: {
    marginBottom: 5,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  actionButtonText: {
    fontSize: 14,
  },
});
