import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '@types';

export const ProfileActions = () => {
  const navigation = useNavigation<AppStackScreenProps>();
  return (
    <View style={styles.container}>
      <Pressable style={styles.actionContainer} onPress={() => navigation.navigate('BoardAction', { actionType: 'view' })}>
        <View style={styles.textContainer}>
          <Ionicons name="chevron-forward" size={20} color={"black"} />
          <Text style={styles.actionText}>최근에 본 게시물</Text>
        </View>
        <View>
          <Ionicons name="chevron-forward" size={24} color={"black"} />
        </View>
      </Pressable>
      <Pressable style={styles.actionContainer} onPress={() => navigation.navigate('BoardAction', { actionType: 'like' })}>
        <View style={styles.textContainer}>
          <Ionicons name="heart-outline" size={20} color={"black"} />
          <Text style={styles.actionText}>좋아요 누른 게시물</Text>
        </View>
        <View>
          <Ionicons name="chevron-forward" size={24} color={"black"} />
        </View>
      </Pressable>
      <Pressable style={styles.actionContainer} onPress={() => navigation.navigate('BoardAction', { actionType: 'hide' })}>
        <View style={styles.textContainer}>
          <Ionicons name="eye-off-outline" size={20} color={"black"} />
          <Text style={styles.actionText}>숨김 처리한 게시물</Text>
        </View>
        <View>
          <Ionicons name="chevron-forward" size={24} color={"black"} />
        </View>
      </Pressable>
    </View>
  )
}

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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 2
  },
})