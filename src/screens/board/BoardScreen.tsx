import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons/';
import { AppRouteScreenProps, AppStackScreenProps, User } from '@types';
import { CommentInput, ProfileImage, EllipsisModal } from '@components';
import { useAuthStore, useCommentInputStore, useEllipsisModalStore } from '@store';
import { timeSince } from '@utils';
import { BoardComment } from './components/BoardComment';
import { KeyboardLayout } from '@layout';
import { useGetBoard, useBoardMenuOptions } from '@hooks';

export const BoardScreen = () => {
  const route = useRoute<AppRouteScreenProps<'Board'>>();
  const navigation = useNavigation<AppStackScreenProps>();
  // 댓글 input ref
  const commentInputRef = useRef<TextInput>(null);

  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);

  const { board } = useGetBoard(route.params.boardId);
  const boardMenuOptions = useBoardMenuOptions(board, user);

  const { setTargetType: setCommentTargetType, setTargetId: setCommentTargetId, mode } = useCommentInputStore();

  useEffect(() => {
    // 헤더 우측 더보기 버튼 설정
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={() => {
          setMenuOptions(boardMenuOptions);
          showEllipsisModal();
        }}>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      ),
    })
    // 댓글 타겟 설정
    if(board) {
      setCommentTargetType('board');
      setCommentTargetId(board.boardId);
    }
  }, [board])

  useEffect(() => {
    if(mode === 'edit' || mode === 'reply') {
      // 댓글 입력창 포커스
      commentInputRef.current?.focus();
    }
  }, [mode])

  return (
    <>
      {/* 더보기 모달 */}
      <EllipsisModal />
      {!board ? (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text>게시글을 불러오는 중입니다...</Text>
        </View>
      ) : (
        <KeyboardLayout>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 70 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ gap: 20, backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{board.title}</Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
                  <Ionicons name='alarm' size={24} color="black" />
                  <Text style={{ fontSize: 14, color: '#666' }}>{timeSince(board.createDate, board.updateDate)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
                  <Ionicons name='eye' size={24} color="black" />
                  <Text style={{ fontSize: 14, color: '#666' }}>{board.views}</Text>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 20, backgroundColor: '#efefef', paddingVertical: 10 }}>
                <View style={{ flex: 0.7, flexDirection: 'row', height: '100%', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <ProfileImage uri={board.user.profileImageUrl} size={50} />
                  <View style={{ flexDirection: 'column', gap: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{board.user.nickname}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>{board.user.introduction}</Text>
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
                  cachePolicy={"disk"}
                />
              </View>
              <Text style={{ fontSize: 18, lineHeight: 24, color: '#333' }}>{board.content}</Text>
              <View style={{ marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="heart-outline" size={24} color="black" />
                  <Text>{board.likes}</Text>
                </View>
              </View>
            </View>
            {/* 댓글 컴포넌트 */}
            <BoardComment board={board}  />
          </ScrollView>
          {/*댓글 입력 컴포넌트*/}
          <CommentInput ref={commentInputRef} />
        </KeyboardLayout>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})