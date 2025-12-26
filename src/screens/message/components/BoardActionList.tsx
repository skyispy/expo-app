import { AppStackScreenProps, Board, BoardAction } from '@types';
import { getDateLabel, getMonthShortName, timeSince } from '@utils';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CustomLoading, ProfileImage, SortOrderPicker } from '@components';
import { Ionicons } from '@expo/vector-icons';
import { useGetBoardActionList } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';

export const BoardActionList = ({
  actionType,
  userId,
}: {
  actionType: BoardAction;
  userId?: number;
}) => {
  const navigation = useNavigation<AppStackScreenProps>();
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    boardList,
    boardActionIsLoading,
    boardActionFetchNextPage,
    boardActionHasNextPage,
    boardActionIsFetchingNextPage,
    boardActionRefetch,
  } = useGetBoardActionList({ userId, actionType, sortOrder });

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    if (!boardActionIsFetchingNextPage) {
      await boardActionRefetch();
    }
    setRefreshing(false);
  };

  // (일별 그룹핑)
  const sections = useMemo(() => {
    if (!boardList || boardList.length === 0) return [];
    // 1. 일별 그룹핑 (Map 사용)
    const grouped = boardList.reduce(
      (acc: Map<string, (Board & { lastActionDate: Date })[]>, board) => {
        const label = getDateLabel(board.lastActionDate);
        if (!acc.has(label)) {
          acc.set(label, []);
        }
        acc.get(label)!.push(board);
        return acc;
      },
      new Map(),
    );
    // 2. 이중 배열로 변환
    let entries = Array.from(grouped.entries());
    // 3. SectionList용 변환
    return entries.map(([label, data]) => ({ label, data }));
  }, [boardList]);

  return boardActionIsLoading ? (
    <CustomLoading />
  ) : (
    <View style={styles.container}>
      <SortOrderPicker sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <SectionList
        style={styles.sectionContainer}
        sections={sections}
        keyExtractor={(item) => 'board_action_' + item.boardId}
        renderSectionHeader={({ section: { label, data } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.day}>{label}</Text>
            <Text style={styles.month}>{getMonthShortName(data[0].lastActionDate)}</Text>
          </View>
        )}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={async () => {
          if (boardActionHasNextPage && !boardActionIsFetchingNextPage) {
            await boardActionFetchNextPage();
          }
        }}
        renderItem={({ item: board }) => (
          <Pressable
            style={styles.boardContainer}
            onPress={() => navigation.navigate('Board', { boardId: board.boardId })}
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={styles.boardContentContainer}>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.title}>
                  {board.title}
                </Text>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.content}>
                  {board.content}
                </Text>
              </View>
              <View style={styles.thumbnailImageContainer}>
                <Image
                  style={styles.thumbnailImage}
                  source={board.thumbnailImageUrl}
                  placeholder={require('@assets/event2.png')}
                  transition={300}
                />
              </View>
            </View>
            <View style={styles.boardFooterContainer}>
              <View style={styles.userContainer}>
                <ProfileImage size={24} uri={board.user.profileImageUrl} />
                <Text style={styles.nickname}>{board.user.nickname}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name={'time-outline'} size={14} color="#555" />
                <Text style={styles.time}>
                  {timeSince(board.lastActionDate, board.lastActionDate)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#aaa' }}>
            데이터가 없습니다.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  sectionContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  day: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  month: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
  },
  sectionFooter: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 16,
  },
  boardContainer: {
    paddingVertical: 16,
  },
  thumbnailImageContainer: {
    width: 160,
    aspectRatio: 16 / 9,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  boardContentContainer: {
    flex: 1,
    gap: 6,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  boardFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
});
