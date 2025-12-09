import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '@types';

export const UserActionSection = () => {
  const navigation = useNavigation<AppStackScreenProps>();
  return (
    <View style={styles.container}>
      <Pressable style={styles.actionButton}>
        <View style={styles.iconContainer}>
          {/* 댓글&멘션 */}
          <Ionicons name={"chatbubble-ellipses-outline"} size={36} color="black" />
        </View>
        <Text style={styles.actionText}>댓글&멘션</Text>
      </Pressable>
      <Pressable style={styles.actionButton} onPress={() => navigation.navigate("BoardAction", { actionType: "like" })}>
        <View style={styles.iconContainer}>
          {/* 좋아요 */}
          <Ionicons name={"heart-outline"} size={36} color="black" />
        </View>
        <Text style={styles.actionText}>좋아요</Text>
      </Pressable>
      <Pressable style={styles.actionButton}>
        <View style={styles.iconContainer}>
          {/* 팔로우 */}
          <Ionicons name={"person-add-outline"} size={36} color="black" />
        </View>
        <Text style={styles.actionText}>팔로우</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    width: '33%',
    padding: 8,
  },
  iconContainer: {
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
  }
})