import { AppStackScreenProps, Board, BoardAction } from '@types';
import { getDateLabel, getMonthShortName, timeSince } from '@utils';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CustomLoading, ProfileImage } from '../../../components';
import { Ionicons } from '@expo/vector-icons';
import { useGetBoardActionList } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const BoardActionList = ({ actionType }: { actionType: BoardAction }) => {
  const navigation = useNavigation<AppStackScreenProps>();
  const queryClient = useQueryClient();
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    await queryClient.refetchQueries({ queryKey: ['boardAction'] });
    setRefreshing(false);
  }

  const { boardList, boardActionIsLoading } = useGetBoardActionList(actionType, sortOrder);

  // 게시물을 월별로 그룹화하는 함수
  const groupByMonth = (boards: (Board & { lastActionDate: Date })[] | undefined) => {
    if (!boards) return {};
    return boards.reduce((acc: { [key: string]: (Board & { lastActionDate: Date })[] }, board) => {
      // label : 오늘, 12월, 11월
      const label = getDateLabel(board.lastActionDate);
      acc[label] = acc[label] ? [...acc[label], board] : [board];
      return acc;
    }, {});
  };

  const groupedBoards = groupByMonth(boardList);

  // SectionList용 데이터 변환
  const todayLabel = '오늘';
  const labels = Object.keys(groupedBoards);
  let sections: { monthLabel: string; monthShortName: string; data: (Board & { lastActionDate: Date })[] }[] = [];
  if (sortOrder === 'latest') {
    sections = [
      ...labels.filter(l => l === todayLabel),
      ...labels.filter(l => l !== todayLabel),
    ].map(label => ({ monthLabel: label, monthShortName: getMonthShortName(label), data: groupedBoards[label] }));
  } else {
    sections = [
      ...labels.filter(l => l !== todayLabel),
      ...labels.filter(l => l === todayLabel),
    ].map(label => ({ monthLabel: label, monthShortName: getMonthShortName(label), data: groupedBoards[label] }));
  }

  if(boardActionIsLoading) {
    return <CustomLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
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
      <SectionList
        style={styles.container}
        sections={sections}
        keyExtractor={(item) => 'board_action' + item.boardId}
        renderSectionHeader={({ section: { monthLabel, monthShortName } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <Text style={styles.monthShortName}>{monthShortName}</Text>
          </View>
        )}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
                <ProfileImage size={28} uri={board.user.profileImageUrl} />
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  monthLabel: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  monthShortName: {
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
    marginBottom: 20,
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
    alignItems: 'center',
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
  deleteButton: {
    marginLeft: 'auto',
    padding: 4,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#FF3B30',
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
})