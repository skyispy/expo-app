import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons/';
import { AppRouteScreenProps, AppStackScreenProps, CommentMode, User } from '@types';
import { EllipsisModal } from '@components';
import { useAuthStore, useEllipsisModalStore } from '@store';
import { KeyboardLayout } from '@layout';
import { useGetBoard, useBoardMenuOptions } from '@hooks';
import { CommentInput } from '@screens/board/components';
import { BoardSection, CommentSection } from '@screens/board/sections';

export const BoardScreen = () => {
  const route = useRoute<AppRouteScreenProps<'Board'>>();
  const { board } = useGetBoard(route.params.boardId);
  const navigation = useNavigation<AppStackScreenProps>();

  const user = useAuthStore((state) => state.user) as User;
  const boardMenuOptions = useBoardMenuOptions(board, user);
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);

  // 댓글 입력 관련 상태
  const commentInputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<CommentMode>('create');
  const [commentValue, setCommentValue] = useState<string>('');
  // 답글 또는 수정할 댓글 ID
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null);
  const [headerText, setHeaderText] = useState<string | null>(null);

  // 댓글 입력 클리어 함수
  const commentClear = () => {
    setMode('create');
    setCommentValue('');
    setTargetCommentId(null);
    setHeaderText(null);
    Keyboard.dismiss(); // 키보드 내리기
  }

  // 댓글 입력 컴포넌트 props
  const commentInputProps = {
    ref: commentInputRef,
    mode,
    value: commentValue,
    setValue: setCommentValue,
    targetCommentId,
    headerText,
    clear: commentClear,
  };

  // 댓글 섹션 컴포넌트 props
  const commentSectionProps = {
    setMode,
    setValue: setCommentValue,
    setTargetCommentId,
    setHeaderText,
  };

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
        <View style={styles.container}>
          <Text>글을 불러오는 중입니다...</Text>
        </View>
      ) : (
        <KeyboardLayout>
          {/*댓글 입력 컴포넌트*/}
          <CommentInput {...commentInputProps} boardId={board.boardId} />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 70 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* 게시글 섹션 */}
            <BoardSection boardId={board.boardId} />
            {/* 댓글 섹션 */}
            <CommentSection {...commentSectionProps} boardId={board.boardId} />
          </ScrollView>
        </KeyboardLayout>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
