import { FlatList, View } from 'react-native';
import { useState } from 'react';
import { useGetUserBoardList } from '@hooks';
import { CustomLoading, EllipsisModal, SortOrderPicker } from '../../../components';
import { BoardPreview } from '@screens/board/components/BoardPreview';

export const ProfileActionBoard = () => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    boardList,
    userBoardIsLoading,
    userBoardFetchNextPage,
    userBoardHasNextPage,
    userBoardIsFetchingNextPage,
    userBoardRefetch,
  } = useGetUserBoardList({ sortOrder });

  if(userBoardIsLoading) {
    return <CustomLoading />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    if (!userBoardIsFetchingNextPage) {
      await userBoardRefetch();
    }
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <EllipsisModal />
      <SortOrderPicker sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <FlatList
        data={boardList}
        renderItem={({ item }) => <BoardPreview board={item} />}
        keyExtractor={(item) => 'user_board_' + item.boardId.toString()}
        onEndReached={async () => {
          if (userBoardHasNextPage && !userBoardIsFetchingNextPage) {
            await userBoardFetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        // ListHeaderComponent={<ProfileBox />}
        // ListFooterComponent={boardIsFetchingNextPage ? <Loading /> : null}
      />
    </View>
  );
}
