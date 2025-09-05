import { View, Text, Image, StyleSheet, TextInputBase, TextInput } from 'react-native';
import { useAuthStore } from '../../store';

export const ProfileEditScreen = () => {
  const { user } = useAuthStore((state) => state);

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={user?.profileImageUrl ?? require('@assets/user.png')}
        />
      </View>
      <Text style={styles.label}>닉네임</Text>
      <TextInput style={styles.textarea} placeholder="닉네임을 입력해주세요." />
      <View>
        <Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 44,
    backgroundColor: '#eee',
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textarea: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});
