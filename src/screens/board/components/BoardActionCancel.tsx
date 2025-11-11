import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Board } from '@types';
import { useBoardHide } from '@hooks';

export const BoardActionCancel = ({ board }: { board: Board }) => {
  const { boardHide } = useBoardHide();

  return (
    <View style={styles.container}>
      <View style={styles.cancelContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>게시물 숨김</Text>
          <Text style={styles.subtitle}>이 게시물과 관련된 게시물이 표시되지 않습니다.</Text>
        </View>
        <Pressable
          style={styles.cancelButton}
          onPress={async () => {
            const { boardId, category: { categoryId } } = board;
            // 취소
            await boardHide({ boardId, categoryId, isHidden: true });
          }}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </Pressable>
      </View>
      <View></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: '#6A49E9',
    fontWeight: 'bold',
    fontSize: 16,
  }
})