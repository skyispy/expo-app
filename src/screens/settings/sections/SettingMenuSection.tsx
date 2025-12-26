import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '@types';

export const SettingMenuSection = () => {
  const navigation = useNavigation<AppStackScreenProps>();
  return (
    <View style={styles.container}>
      <Pressable style={styles.actionContainer} onPress={() => navigation.navigate('ProfileEdit')}>
        <View style={styles.textContainer}>
          <Ionicons name="person-outline" size={20} color={'black'} />
          <Text style={styles.actionText}>프로필 수정</Text>
        </View>
        <View>
          <Ionicons name="chevron-forward" size={24} color={'black'} />
        </View>
      </Pressable>
      <Pressable style={styles.actionContainer}>
        <View style={styles.textContainer}>
          <Ionicons name="notifications-outline" size={20} color={'black'} />
          <Text style={styles.actionText}>푸시알림 관리</Text>
        </View>
        <View>
          <Ionicons name="chevron-forward" size={24} color={'black'} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000',
    // // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 2,
  },
});
