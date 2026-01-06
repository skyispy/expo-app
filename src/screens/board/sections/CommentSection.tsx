import { Pressable, StyleSheet, Text, View } from 'react-native';
import { User, Comment, CommentMode } from '@types';
import { useCommentMenuOptions, useGetCommentList } from '@hooks';
import { ProfileImage } from '@components';
import { timeSince } from '@utils';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useEllipsisModalStore } from '@store';
import { Fragment, useState } from 'react';

type CommentSectionProps = {
  boardId: number;
  setMode: (mode: CommentMode) => void;
  setValue : (value: string) => void;
  setTargetCommentId: (commentId: number) => void;
  setHeaderText: (text: string) => void;
};

export const CommentSection = ({
  boardId,
  setMode,
  setValue,
  setTargetCommentId,
  setHeaderText,
}: CommentSectionProps) => {
  // 페이지네이션 상태 추가
  const [page, setPage] = useState(1);
  const limit = 3;
  const { commentList, commentCount, commentRefetch, isFetching, totalPages } = useGetCommentList({
    boardId,
    page,
    limit,
  });

  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);
  const getCommentMenuOptions = useCommentMenuOptions(user);

  // 대댓글 버튼 함수
  const handleReplyPress = (comment: Comment) => {
    // 대댓글 작성 모드로 전환
    setMode('reply');
    setTargetCommentId(comment.parent ? comment.parent.commentId : comment.commentId);
    setHeaderText(comment.user.nickname + '님에게 답글 쓰기');
  };

  // 댓글 메뉴 버튼 함수
  const handleCommentMenuPress = (comment: Comment) => {
    const commentMenuOptions = getCommentMenuOptions(comment);
    commentMenuOptions.map((menuOption) => {
      if (menuOption.id === 'comment_edit') {
        menuOption.action = () => {
          setMode('edit');
          setValue(comment.content);
          setHeaderText('댓글 수정');
          setTargetCommentId(comment.commentId);
        };
      }
      return menuOption;
    });
    setMenuOptions(commentMenuOptions);
    showEllipsisModal();
  };

  // 페이지 번호 버튼 렌더링 함수
  const renderPageButtons = () => {
    if (!totalPages) return null;
    let start = 1;
    let end = totalPages;
    if (totalPages > 5) {
      if (page <= 3) {
        start = 1;
        end = 5;
      } else if (page >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      } else {
        start = page - 2;
        end = page + 2;
      }
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
      <Pressable
        key={p}
        style={[styles.paginationNavButton, { backgroundColor: p === page ? '#6A49E9' : '#eee' }]}
        onPress={() => setPage(p)}
        disabled={p === page}
      >
        <Text style={[styles.paginationButtonText, { color: p === page ? '#fff' : '#333' }]}>
          {p}
        </Text>
      </Pressable>
    ));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>댓글 {commentCount}</Text>
        <Pressable>
          <Ionicons name="refresh" size={24} color="black" onPress={() => commentRefetch()} />
        </Pressable>
      </View>
      <View>
        {isFetching ? (
          <Text>댓글을 불러오는 중입니다...</Text>
        ) : (
          commentList.map(
            (comment) =>
              !comment.parent && (
                <Fragment key={'comment_' + comment.commentId}>
                  <View style={styles.commentContainer}>
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
                        onPress={() => handleCommentMenuPress(comment)}
                      >
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                      </Pressable>
                    </View>
                    <View style={styles.main}>
                      <Text>{comment.content}</Text>
                    </View>
                    <View style={styles.footer}>
                      <View style={styles.actionButtonContainer}>
                        <Pressable
                          style={styles.actionButton}
                          onPress={() => handleReplyPress(comment)}
                        >
                          <Ionicons name={'chatbubble-ellipses-outline'} size={16} color="#666" />
                          <Text>답글</Text>
                        </Pressable>
                        <Pressable style={styles.actionButton}>
                          <Ionicons
                            name={comment.isLiked ? 'heart' : 'heart-outline'}
                            size={16}
                            color={comment.isLiked ? 'red' : 'black'}
                          />
                          <Text>{comment.likes}</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  {comment.children &&
                    comment.children.map((reply) => (
                      <View
                        key={'comment_' + reply.commentId}
                        style={[
                          styles.commentContainer,
                          { paddingLeft: 40, backgroundColor: '#eee' },
                        ]}
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
                            onPress={() => handleCommentMenuPress(reply)}
                          >
                            <Ionicons name="ellipsis-vertical" size={24} color="black" />
                          </Pressable>
                        </View>
                        <View style={styles.main}>
                          <Text>{reply.content}</Text>
                        </View>
                      </View>
                    ))}
                </Fragment>
              ),
          )
        )}
      </View>
      <View style={styles.paginationContainer}>
        {totalPages && totalPages > 1 && page > 3 ? (
          <Pressable style={styles.paginationNavButton} onPress={() => setPage(page - 1)}>
            <Text style={styles.paginationButtonText}>{'<'}</Text>
          </Pressable>
        ) : null}
        {renderPageButtons()}
        {totalPages && totalPages > 5 && page < totalPages - 2 ? (
          <Pressable style={styles.paginationNavButton} onPress={() => setPage(page + 1)}>
            <Text style={styles.paginationButtonText}>{'>'}</Text>
          </Pressable>
        ) : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  paginationNavButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#eee',
    marginHorizontal: 2,
  },
  paginationButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
