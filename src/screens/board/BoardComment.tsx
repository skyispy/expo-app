import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Board, User } from '../../types';
import { useGetCommentList } from '../../hooks';
import { ProfileImage } from '../../components';
import { getCommentMenuOptions, timeSince } from '../../utils';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useEllipsisModalStore } from '../../store';

export const BoardComment = ({ board }: { board: Board }) => {
  const { commentList, commentFetchNextPage, commentRefetch } = useGetCommentList(board.boardId);
  const user = useAuthStore((state) => state.user) as User;
  // 더보기 모달
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>댓글 {commentList?.length ?? 0}</Text>
      </View>
      <View>
        {commentList && commentList.map((comment) => (
          <View key={comment.commentId} style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <View style={styles.profileContainer}>
                <ProfileImage uri={comment.user.profileImageUrl} size={36} />
                <View style={styles.profileTextContainer}>
                  <Text style={styles.nickname}>{comment.user.nickname}</Text>
                  <Text style={styles.commentDate}>{timeSince(comment.createDate, comment.updateDate)}</Text>
                </View>
              </View>
              <Pressable style={styles.ellipsisButton} onPress={() => {
                setMenuOptions(getCommentMenuOptions(comment.user, user));
                showEllipsisModal();
              }}>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </Pressable>
            </View>
            <View style={styles.main}>
              <Text>{comment.content}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  header: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  commentContainer: {
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileTextContainer: {
    height: '100%',
    paddingVertical: 4,
    gap: 4,
  },
  nickname: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  ellipsisButton: {
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    gap: 6,
    paddingLeft: 46,
  },
})