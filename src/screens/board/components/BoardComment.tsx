import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Board, User, Comment } from '@types';
import { useCommentMenuOptions, useGetCommentList } from '@hooks';
import { ProfileImage } from '../../../components';
import { timeSince } from '@utils';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useCommentInputStore, useEllipsisModalStore } from '@store';
import { Fragment } from 'react';

export const BoardComment = ({ board }: { board: Board }) => {
  const { commentList, commentCount, commentFetchNextPage, commentRefetch } = useGetCommentList(
    'board',
    board.boardId,
  );

  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);
  const { setMode, setParentCommentId, setHeaderText } = useCommentInputStore();
  const getCommentMenuOptions = useCommentMenuOptions(user);

  // 대댓글 버튼 함수
  const handleReplyPress = (comment: Comment) => {
    // 대댓글 작성 모드로 전환
    setMode('reply');
    setParentCommentId(comment.parent ? comment.parent.commentId : comment.commentId);
    setHeaderText(comment.user.nickname + '님에게 답글 쓰기');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>댓글 {commentCount ?? 0}</Text>
      </View>
      <View>
        {commentList &&
          commentList.map(
            (comment) =>
              !comment.parent && (
                <Fragment key={comment.commentId}>
                  <Pressable
                    style={styles.commentContainer}
                    onPress={() => handleReplyPress(comment)}
                  >
                    <View style={styles.commentHeader}>
                      <View style={styles.profileContainer}>
                        <ProfileImage uri={comment.user.profileImageUrl} size={36} />
                        <View style={styles.profileTextContainer}>
                          <Text style={styles.nickname}>{comment.user.nickname}</Text>
                          <Text style={styles.commentDate}>
                            {timeSince(comment.createDate, comment.updateDate)}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        style={styles.ellipsisButton}
                        onPress={() => {
                          const commentMenuOptions = getCommentMenuOptions(comment);
                          setMenuOptions(commentMenuOptions);
                          showEllipsisModal();
                        }}
                      >
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                      </Pressable>
                    </View>
                    <View style={styles.main}>
                      <Text>{comment.content}</Text>
                    </View>
                  </Pressable>
                  {comment.children &&
                    comment.children.map((reply) => (
                      <Pressable
                        key={reply.commentId}
                        style={[
                          styles.commentContainer,
                          { paddingLeft: 40, backgroundColor: '#eee' },
                        ]}
                        onPress={() => handleReplyPress(reply)}
                      >
                        <Ionicons
                          name={'return-down-forward'}
                          size={24}
                          color={'black'}
                          style={{ position: 'absolute', left: 10, top: 20 }}
                        />
                        <View style={styles.commentHeader}>
                          <View style={styles.profileContainer}>
                            <ProfileImage uri={reply.user.profileImageUrl} size={36} />
                            <View style={styles.profileTextContainer}>
                              <Text style={styles.nickname}>{reply.user.nickname}</Text>
                              <Text style={styles.commentDate}>
                                {timeSince(reply.createDate, reply.updateDate)}
                              </Text>
                            </View>
                          </View>
                          <Pressable
                            style={styles.ellipsisButton}
                            onPress={() => {
                              const commentMenuOptions = getCommentMenuOptions(reply);
                              setMenuOptions(commentMenuOptions);
                              showEllipsisModal();
                            }}
                          >
                            <Ionicons name="ellipsis-vertical" size={24} color="black" />
                          </Pressable>
                        </View>
                        <View style={styles.main}>
                          <Text>{reply.content}</Text>
                        </View>
                      </Pressable>
                    ))}
                </Fragment>
              ),
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
});
