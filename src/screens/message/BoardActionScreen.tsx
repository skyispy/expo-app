import { useNavigation, useRoute } from '@react-navigation/native';
import { AppRouteScreenProps, AppStackScreenProps, Board } from '@types';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { CustomLoading, ProfileImage } from '@components';
import { useGetBoardActionList } from '@hooks';
import { getDateLabel } from '@utils';

export const BoardActionScreen = () => {
  const route = useRoute<AppRouteScreenProps<'BoardAction'>>();
  const navigation = useNavigation<AppStackScreenProps>();
  const { actionType } = route.params;

  const { boardList, boardActionIsLoading } = useGetBoardActionList(actionType);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if(actionType === 'view') {
      navigation.setOptions({ headerTitle: '최근에 본 게시물' });
    } else if(actionType === 'like') {
      navigation.setOptions({ headerTitle: '좋아요 누른 게시물' });
    } else if(actionType === 'hide') {
      navigation.setOptions({ headerTitle: '숨김 처리한 게시물' });
    }
  }, [actionType]);

  useEffect(() => {
    return navigation.addListener('transitionEnd', () => {
      setIsLoading(false);
    });
  }, [navigation]);

  // 게시물을 날짜별로 그룹화하는 함수
  const groupByDate = (boards: (Board & { lastActionDate: Date })[] | undefined) => {
    if (!boards) return {};
    return boards.reduce((acc: { [key: string]: (Board & { lastActionDate: Date })[] }, board) => {
      // label : 오늘, 어제, 2025. 11. 19
      const label = getDateLabel(board.lastActionDate);
      acc[label] = acc[label] ? [...acc[label], board] : [board];
      return acc;
    }, {});
  };

  useEffect(() => {
    return navigation.addListener('transitionEnd', () => setIsLoading(false));
  }, [navigation]);

  const groupedBoards = groupByDate(boardList);

  return (
    <>
      {(isLoading || boardActionIsLoading) ? (
        <CustomLoading />
      ) : (
        <ScrollView style={styles.container}>
          {Object.entries(groupedBoards).map(([label, boards]) => (
            <View key={label}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 8 }}>{label}</Text>
              {boards.map((board) => (
                <Pressable style={styles.boardContainer} key={"board_action" + board.boardId}>
                  <View style={styles.thumbnailImageContainer}>
                    <Image
                      style={styles.thumbnailImage}
                      source={board.thumbnailImageUrl}
                      placeholder={require('@assets/event2.png')}
                      transition={1000}
                    />
                  </View>
                  <View style={styles.boardContentContainer}>
                    <Text style={styles?.title}>{board.title}</Text>
                    <View style={styles?.userContainer}>
                      <ProfileImage size={32} uri={board.user.profileImageUrl} />
                      <Text style={styles.nickname}>{board.user.nickname}</Text>
                    </View>
                    <Text style={styles.content}>{board.content}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  boardContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumbnailImageContainer: {
    width: 120,
    height: 120,
    marginRight: 12,
    backgroundColor: '#eee',
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nickname: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  content: {
    fontSize: 14,
    color: '#333',
  }
})