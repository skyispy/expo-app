import { FlatList, View, StyleSheet } from 'react-native';
import { useGetBoardList } from '../../hooks';
import { BoardPreview } from '@screens/board/BoardPreview';
import { EllipsisModal } from '../../components/EllipsisModal';
import { useState } from 'react';

export const BoardListScreen = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    boardList,
    boardFetchNextPage,
    boardHasNextPage,
    boardIsFetchingNextPage,
    boardRefetch
  } = useGetBoardList('free');

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    if(!boardIsFetchingNextPage){
      await boardRefetch();
    }
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={boardList}
        renderItem={({ item }) => <BoardPreview board={item} />}
        keyExtractor={(item) => item.boardId.toString()}
        onEndReached={() => {
          if (boardHasNextPage && !boardIsFetchingNextPage) {
            boardFetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        // ListHeaderComponent={<ProfileBox />}
        // ListFooterComponent={boardIsFetchingNextPage ? <Loading /> : null}
      />
      <EllipsisModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})