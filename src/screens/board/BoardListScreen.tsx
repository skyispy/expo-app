import { FlatList, View, StyleSheet, Pressable, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useGetBoardList, useGetChannelList } from '@hooks';
import { BoardPreview } from './components/BoardPreview';
import { EllipsisModal } from '@components';
import { Category } from '@types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { BoardActionCancel } from '@screens/board/components/BoardActionCancel';

export const BoardListScreen = () => {
  const queryClient = useQueryClient();
  const [channelId, setChannelId] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { channelList } = useGetChannelList();

  useEffect(() => {
    AsyncStorage.getItem('boardSelection').then(value => {
      if (value) {
        const boardItem = JSON.parse(value);
        setChannelId(boardItem.channelId);
        setCategoryId(boardItem.categoryId);
      }
    })
  }, []);

  const {
    boardList,
    boardFetchNextPage,
    boardHasNextPage,
    boardIsFetchingNextPage,
  } = useGetBoardList(categoryId);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    if(!boardIsFetchingNextPage){
      await queryClient.refetchQueries({ queryKey: ['board'] });
    }
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.channelListContainer}>
        <FlatList
          data={channelList}
          horizontal
          renderItem={({ item }) => (
            // 채널 아이템 컴포넌트로 교체 필요
            <Pressable
              style={[styles.channelContainer, { transform: [{ scale: item.channelId === channelId ? 1.2 : 1 }] }]}
              onPress={async () => {
                const boardItem = { channelId: item.channelId, categoryId: (item.categoryList as Category[])[0]?.categoryId }
                setChannelId(boardItem.channelId);
                setCategoryId(boardItem.categoryId);
                await AsyncStorage.setItem('boardSelection', JSON.stringify(boardItem));
              }}
            >
              <View style={{ width: '60%', height: '60%' }}>
                <Image
                  source={{ uri: item.channelImageUrl ?? undefined }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.channelId.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.categoryListContainer}>
        <FlatList
          data={channelList?.find(c => c.channelId === channelId)?.categoryList || []}
          horizontal
          renderItem={({ item }) => (
            // 카테고리 아이템 컴포넌트로 교체 필요
            <Pressable
              style={styles.categoryContainer}
              onPress={async () => {
                setCategoryId(item.categoryId);
                const boardItem = { channelId: channelId, categoryId: item.categoryId }
                await AsyncStorage.setItem('boardSelection', JSON.stringify(boardItem));
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{ color: item.categoryId === categoryId ? 'blue' : 'black', fontWeight: item.categoryId === categoryId ? 'bold' : 'normal' }}
                >{item.categoryName}</Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.categoryId.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        data={boardList}
        renderItem={({ item }) => !!item.isHidden ? <BoardActionCancel board={item} /> : <BoardPreview board={item} />}
        keyExtractor={(item) => item.boardId.toString()}
        onEndReached={async () => {
          if (boardHasNextPage && !boardIsFetchingNextPage) {
            await boardFetchNextPage();
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
  },
  channelListContainer: {
    width: '100%',
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
  },
  channelContainer: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryListContainer: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
  },
  categoryContainer: {
    height: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
})