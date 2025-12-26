import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SlideModalLayoutProps = {
  children: ReactNode;
  modalStore: {
    isVisible: boolean;
    hide: () => void;
    show: () => void;
  };
  title: string;
};

export const SlideModalLayout = ({ children, modalStore, title }: SlideModalLayoutProps) => {
  const { isVisible, hide } = modalStore;
  const { bottom } = useSafeAreaInsets();
  return (
    <View>
      <Modal
        animationType="slide"
        visible={isVisible}
        transparent={true}
        onRequestClose={hide}
        allowSwipeDismissal={true}
      >
        <View style={styles.container}>
          {/* 모달 바깥 영역 클릭 시 모달 닫히도록 */}
          <Pressable style={styles.overlay} onPress={hide} />
          <View style={styles.header}>
            <Pressable style={{ width: '30%' }} onPress={hide}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ width: '30%' }} />
          </View>
          {children}
          <View style={{ height: bottom, backgroundColor: '#fff' }} />
        </View>
      </Modal>
    </View>
  );
};

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
    height: 70,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
