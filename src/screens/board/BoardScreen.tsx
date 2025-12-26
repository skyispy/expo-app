import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons/';
import { AppRouteScreenProps, AppStackScreenProps, User } from '@types';
import { CommentInput, ProfileImage, EllipsisModal } from '@components';
import { useAuthStore, useCommentInputStore, useEllipsisModalStore } from '@store';
import { timeSince } from '@utils';
import { BoardComment } from './components/BoardComment';
import { KeyboardLayout } from '@layout';
import { useGetBoard, useBoardMenuOptions, useBoardLike } from '@hooks';

export const BoardScreen = () => {
  const route = useRoute<AppRouteScreenProps<'Board'>>();
  const navigation = useNavigation<AppStackScreenProps>();
  // 댓글 input ref
  const commentInputRef = useRef<TextInput>(null);

  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);
  const {
    setTargetType: setCommentTargetType,
    setTargetId: setCommentTargetId,
    mode,
  } = useCommentInputStore();

  const { board } = useGetBoard(route.params.boardId);
  const boardMenuOptions = useBoardMenuOptions(board, user);
  const { boardLike } = useBoardLike();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 헤더 우측 더보기 버튼 설정
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => {
            setMenuOptions(boardMenuOptions);
            showEllipsisModal();
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      ),
    });

    return navigation.addListener('transitionEnd', () => setIsLoading(false));
  }, [navigation, boardMenuOptions]);

  useEffect(() => {
    // 댓글 타겟 설정
    if (board) {
      setCommentTargetType('board');
      setCommentTargetId(board.boardId);
    }
  }, [board]);

  useEffect(() => {
    if (mode === 'edit' || mode === 'reply') {
      // 댓글 입력창 포커스
      commentInputRef.current?.focus();
    }
  }, [mode]);

  return (
    <>
      {/* 더보기 모달 */}
      <EllipsisModal />
      {!board || isLoading ? (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text>글을 불러오는 중입니다...</Text>
        </View>
      ) : (
        <KeyboardLayout>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 70 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.boardContainer}>
              <Text style={styles.title}>{board.title}</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="time" size={18} color="gray" />
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    {timeSince(board.createDate, board.updateDate)}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="eye" size={18} color="gray" />
                  <Text style={{ fontSize: 14, color: '#666' }}>{board.views}</Text>
                </View>
              </View>
              <View style={styles.userContainer}>
                <View style={styles.userProfile}>
                  <ProfileImage uri={board.user.profileImageUrl} size={50} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userNickname}>{board.user.nickname}</Text>
                    <Text style={styles.userIntro}>{board.user.introduction}</Text>
                  </View>
                </View>
                <View style={styles.actionContainer}>
                  {user.userId !== board.user.userId && (
                    <TouchableOpacity style={styles.followButton}>
                      <Text style={styles.followButtonText}>팔로우</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.thumbnailContainer}>
                <Image
                  style={styles.thumbnail}
                  source={{ uri: board.thumbnailImageUrl || undefined }}
                  placeholder={require('@assets/event2.png')}
                  transition={300}
                  contentFit={'cover'}
                  cachePolicy={'disk'}
                />
              </View>
              <Text style={styles.content}>{board.content}</Text>
              <Pressable
                style={styles.metaContainer}
                onPress={() => {
                  return boardLike({
                    boardId: board.boardId,
                    isLiked: board.isLiked,
                    categoryId: board.category.categoryId,
                  });
                }}
              >
                <Ionicons
                  name={board.isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={board.isLiked ? 'red' : 'black'}
                />
                <Text style={styles.metaCount}>{board.likes}</Text>
              </Pressable>
            </View>
            {/* 댓글 컴포넌트 */}
            <BoardComment board={board} />
          </ScrollView>
          {/*댓글 입력 컴포넌트*/}
          <CommentInput ref={commentInputRef} />
        </KeyboardLayout>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boardContainer: {
    gap: 20,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#efefef',
    paddingVertical: 10,
  },
  userProfile: {
    flex: 0.7,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  userNickname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userIntro: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  followButton: {
    minWidth: '18%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6A49E9',
    backgroundColor: '#fff',
  },
  followButtonText: {
    color: '#6A49E9',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  metaCount: {
    fontSize: 16,
    color: '#666',
  },
});
