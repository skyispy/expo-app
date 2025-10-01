import { FlatList, View, StyleSheet } from 'react-native';
import { useGetBoardList } from '../../hooks';
import { BoardPreview } from '@screens/board/BoardPreview';

export const BoardListScreen = () => {
  const { boardList, boardFetchNextPage, boardHasNextPage, boardIsFetchingNextPage } = useGetBoardList('free', 3, 1);

  return (
    <View style={styles.container}>
      <FlatList
        data={boardList}
        renderItem={({ item }) => <BoardPreview board={item} />}
        keyExtractor={(item, index) => item.boardId.toString()}
        onEndReached={() => {
          if (boardHasNextPage && !boardIsFetchingNextPage) {
            boardFetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={boardIsFetchingNextPage ? <Loading /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 20,
  }
})