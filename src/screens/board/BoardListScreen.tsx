import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetBoards } from '../../hooks';
import { BoardPreview } from '@screens/board/BoardPreview';

export const BoardListScreen = () => {
  const { boards, isBoardsLoading } = useGetBoards('event');

  return (
    <ScrollView style={styles.container}>
      {boards && boards.map((board => (
        <BoardPreview board={board} key={board.boardId} />
      )))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  }
})