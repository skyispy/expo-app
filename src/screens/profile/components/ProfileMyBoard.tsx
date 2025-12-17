import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useGetMyBoardList } from '@hooks';
import { CustomLoading, EllipsisModal } from '../../../components';
import { BoardPreview } from '@screens/board/components/BoardPreview';
import { useQueryClient } from '@tanstack/react-query';

export const ProfileMyBoard = () => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { boardList, myBoardIsLoading, myBoardFetchNextPage, myBoardHasNextPage, myBoardIsFetchingNextPage }
    = useGetMyBoardList(sortOrder);

  if(myBoardIsLoading) {
    return <CustomLoading />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    if (!myBoardIsFetchingNextPage) {
      await queryClient.refetchQueries({ queryKey: ['myBoard'] });
    }
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <EllipsisModal />
      <View style={styles.sortingHeader}>
        <Pressable
          style={
            sortOrder === 'latest'
              ? [styles.sortingContainer, { backgroundColor: '#A084E8', borderColor: '#A084E8' }]
              : styles.sortingContainer
          }
          onPress={() => setSortOrder('latest')}
        >
          <Text
            style={
              sortOrder === 'latest' ? [styles.sortingText, { color: '#fff' }] : styles.sortingText
            }
          >
            최신순
          </Text>
        </Pressable>
        <Pressable
          style={
            sortOrder === 'oldest'
              ? [styles.sortingContainer, { backgroundColor: '#A084E8', borderColor: '#A084E8' }]
              : styles.sortingContainer
          }
          onPress={() => setSortOrder('oldest')}
        >
          <Text
            style={
              sortOrder === 'oldest' ? [styles.sortingText, { color: '#fff' }] : styles.sortingText
            }
          >
            오래된 순
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={boardList}
        renderItem={({ item }) => <BoardPreview board={item} />}
        keyExtractor={(item) => 'my_board' + item.boardId.toString()}
        onEndReached={async () => {
          if (myBoardHasNextPage && !myBoardIsFetchingNextPage) {
            await myBoardFetchNextPage();
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

const styles = StyleSheet.create({
  sortingHeader: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  sortingContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6A49E9',
  },
  sortingText: {
    color: '#6A49E9',
    fontSize: 12,
  },
});