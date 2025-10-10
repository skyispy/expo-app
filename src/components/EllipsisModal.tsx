import { View, Modal, StyleSheet, Text, Pressable } from 'react-native';
import { useEllipsisModalStore } from '../store';
import { Ionicons } from '@expo/vector-icons/';

export const EllipsisModal = () => {
  const { isVisible, hide, menuOptions } = useEllipsisModalStore();
  return (
    <View>
      <Modal
        animationType="slide"
        visible={isVisible}
        transparent={true}
        onRequestClose={hide}
      >
        <View style={styles.container}>
          {/* 모달 바깥 영역 클릭 시 모달 닫히도록 */}
          <Pressable style={styles.overlay} onPress={hide} />
          <View style={styles.header}>
            <Pressable onPress={hide}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
            <Text style={styles.headerTitle}>더보기</Text>
            <View />
          </View>
          <View style={styles.menuContainer}>
            {menuOptions?.map((item, i) => (
              <Pressable key={i} style={styles.menuButton} onPress={() => {
                item.action();
                hide();
              }}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={24} color='black' />
                </View>
                <Text style={styles.menuButtonText}>{item.label}</Text>
              </Pressable>
            ))}
            {/*<Pressable style={styles.menuButton}>*/}
            {/*  <View style={styles.iconContainer}>*/}
            {/*    <Ionicons name='share-outline' size={24} color='black' />*/}
            {/*  </View>*/}
            {/*  <Text style={styles.menuButtonText}>공유하기</Text>*/}
            {/*</Pressable>*/}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#333',
  },
})