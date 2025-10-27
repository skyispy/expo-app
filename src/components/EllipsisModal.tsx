import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useEllipsisModalStore } from '@store';
import { Ionicons } from '@expo/vector-icons/';
import { SlideModalLayout } from '@layout';

export const EllipsisModal = () => {
  const ellipsisModalStore = useEllipsisModalStore();
  return (
    <SlideModalLayout
      modalStore={ellipsisModalStore}
      title={"더보기"}
    >
      <View style={styles.menuContainer}>
        {ellipsisModalStore.menuOptions?.map((item, i) => (
          <Pressable key={i} style={styles.menuButton} onPress={() => {
            item.action();
            ellipsisModalStore.hide();
          }}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={24} color='black' />
            </View>
            <Text style={styles.menuButtonText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </SlideModalLayout>
  )
}

const styles = StyleSheet.create({
  menuContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
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