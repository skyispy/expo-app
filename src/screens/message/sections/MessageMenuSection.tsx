import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '@types';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';

export const MessageMenuSection = () => {
  const navigation = useNavigation<AppStackScreenProps>()

  return (
    <View style={styles.container}>
      {/* 시스템 알림 */}
      <Pressable style={styles.menuButton} onPress={() => navigation.navigate("BoardAction", { actionType: "board" })}>
        <View style={styles.iconWrapper}>
          <View style={[styles.iconContainer, { backgroundColor: '#4A90E2' }]}>
            <Ionicons name={"megaphone-outline"} size={30} color="#fff" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>시스템 알림</Text>
          <Text style={styles.content} numberOfLines={1} ellipsizeMode={"tail"}>20시간전</Text>
        </View>
      </Pressable>
      {/* 가이드북 */}
      <Pressable style={styles.menuButton} onPress={() => navigation.navigate("BoardAction", { actionType: "like" })}>
        <View style={styles.iconWrapper}>
          {/*backgroundColor: '#007AFF',*/}
          <View style={[styles.iconContainer, { backgroundColor: '#34C759' }]}>
            <Ionicons name={"book-outline"} size={30} color="#fff" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>가이드북</Text>
          <Text style={styles.content} numberOfLines={1} ellipsizeMode={"tail"}></Text>
        </View>
      </Pressable>
      {/* 이벤트 알림 */}
      <Pressable style={styles.menuButton} onPress={() => navigation.navigate("BoardAction", { actionType: "board" })}>
        <View style={styles.iconWrapper}>
          {/*backgroundColor: '#007AFF',*/}
          <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
            <Ionicons name={"calendar-outline"} size={30} color="#fff" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>이벤트 알림</Text>
          <Text style={styles.content} numberOfLines={1} ellipsizeMode={"tail"}></Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
    gap: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    padding: 10,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    height: '100%',
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 6,
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  }
})