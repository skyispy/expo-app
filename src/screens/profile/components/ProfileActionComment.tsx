import { View, StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { useGetUserCommentList } from '@hooks';
import { useState } from 'react';
import { AppStackScreenProps, SortOrder } from '@types';
import { CustomLoading, SortOrderPicker } from '@components';
import { getMonthShortName } from '@utils';
import { Ionicons } from '@expo/vector-icons/';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

export const ProfileActionComment = () => {
  const navigation = useNavigation<AppStackScreenProps>();

  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 여기에 새로고침 로직 추가 (예: refetch)
    if (!userCommentIsFetchingNextPage) {
      await userCommentRefetch();
    }
    setRefreshing(false);
  };

  const {
    commentList,
    userCommentIsLoading,
    userCommentFetchNextPage,
    userCommentHasNextPage,
    userCommentIsFetchingNextPage,
    userCommentRefetch,
  } = useGetUserCommentList({ sortOrder });

  return userCommentIsLoading || !commentList ? (
    <CustomLoading />
  ) : (
    <View style={styles.container}>
      <SortOrderPicker sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <FlatList
        data={commentList}
        keyExtractor={(item) => 'user_comment_' + item.commentId.toString()}
        onEndReached={async () => {
          if (userCommentHasNextPage && !userCommentIsFetchingNextPage) {
            await userCommentFetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => {
          const commentDate = new Date(item.createDate);
          return (
            <Pressable style={styles.commentContainer}>
              <View style={styles.commentHeader}>
                <Text style={styles.day}>{commentDate.getDate()}</Text>
                <Text style={styles.month}>{getMonthShortName(item.createDate)}</Text>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.commentText}>{item.content}</Text>
                {item.parent && (
                  <Text style={styles.parentCommentText}>답글: {item.parent.content}</Text>
                )}
                {item.targetType === 'board' && (
                  <Pressable
                    style={styles.targetContainer}
                    onPress={() => navigation.navigate('Board', { boardId: item.target.boardId })}
                  >
                    <View style={styles.thumbnailContainer}>
                      <Image
                        source={{ uri: item.target.thumbnailImageUrl ?? undefined }}
                        style={styles.thumbnailImage}
                        contentFit="cover"
                      />
                    </View>
                    <View style={styles.targetTextContainer}>
                      <Text style={styles.targetTitle}>{item.target?.title}</Text>
                    </View>
                  </Pressable>
                )}
              </View>
              <View style={styles.commentFooter}>
                <Text>{item.target?.category.channel?.channelName}</Text>
                <View style={styles.actionButtonContainer}>
                  <Pressable style={styles.actionButton}>
                    <Ionicons name={'chatbubble-ellipses-outline'} size={16} color="#666" />
                    <Text style={styles.actionButtonText}>딥글</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Ionicons name={'heart-outline'} size={16} color="#666" />
                    <Text style={styles.actionButtonText}>좋아요</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  commentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentHeader: {
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
  contentContainer: {
    marginBottom: 12,
  },
  commentText: {
    fontSize: 18,
  },
  parentCommentText: {
    fontSize: 12,
    color: '#666',
    borderLeftWidth: 2,
    borderColor: '#ddd',
    marginTop: 10,
    paddingLeft: 10,
    marginLeft: 6,
    paddingVertical: 6,
  },
  targetContainer: {
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  targetTextContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  targetTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingVertical: 16,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
  },
});
