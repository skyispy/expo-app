import { AppRouteScreenProps, AppStackScreenProps, Board, Comment, User } from '@types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useBoardHide, useDeleteBoard } from './useBoard';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentInputStore } from '@store';
import { useDeleteComment } from './useCommon';

export const useBoardMenuOptions = (board: Board | undefined, user: User) => {
  const navigation = useNavigation<AppStackScreenProps>();
  const route = useRoute<AppRouteScreenProps<'BoardList' | 'Board'>>();
  const { deleteBoard } = useDeleteBoard();
  const { boardHide } = useBoardHide();

  if(!board) return [];
  const isAuthor = user.userId === board.user.userId;
  const menuOptions = [];
  const editOption = {
    label: '게시글 수정',
    icon: 'pencil-outline',
    action: () => {
      navigation.navigate('BoardStep1', { boardId: board.boardId });
    },
  };
  const deleteOption = {
    label: '게시글 삭제',
    icon: 'trash-outline',
    action: () => {
      Alert.alert('게시글 삭제', '정말로 게시글을 삭제하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await deleteBoard(board?.boardId);
          },
        },
      ]);
    },
  };
  const reportOption = {
    label: '신고하기',
    icon: 'flag-outline',
    action: () => console.log(''),
  }
  const hideOption = {
    label: '게시글 숨기기',
    icon: 'eye-off-outline',
    action: async () => {
      const { boardId, category: { categoryId } } = board;
      // 숨기기
      await boardHide({ boardId, categoryId, isHidden: false });
    }
  }
  const shareOption = {
    label: '게시글 공유',
    icon: 'share-social-outline',
    action: () => console.log(''),
  }
  const followOption = {
    label: '팔로우하기',
    icon: 'person-add-outline',
    action: () => console.log(''),
  }
  if (isAuthor) {
    menuOptions.push(editOption, deleteOption);
  } else {
    if(route.name === 'BoardList') {
      menuOptions.push(reportOption, hideOption, shareOption, followOption);
    } else {
      menuOptions.push(reportOption, shareOption, followOption);
    }
  }
  return menuOptions;

}

export const useCommentMenuOptions = (user: User) => {
  const queryClient = useQueryClient();
  const { setMode, setValue, setCommentId, setHeaderText } = useCommentInputStore();
    const { deleteComment } = useDeleteComment();
  return (comment: Comment) => {
    const isAuthor = user.userId === comment.user.userId;
    const menuOptions = [];
    const editOption = {
      label: '댓글 수정',
      icon: 'pencil-outline',
      action: () => {
        setMode('edit');
        setValue(comment.content);
        setCommentId(comment.commentId);
        setHeaderText('댓글 입력');
      },
    };
    const deleteOption = {
      label: '댓글 삭제',
      icon: 'trash-outline',
      action: () => {
        Alert.alert('댓글 삭제', '댓글을 삭제하시겠습니까?', [
          {
            text: '확인',
            onPress: async () => {
              await deleteComment(comment.commentId, {
                onSettled: () => queryClient.invalidateQueries({ queryKey: ['commentList', { targetType: comment.targetType, targetId: comment.targetId }] })
              });
            }
          },
          { text: '취소', style: 'cancel' }
        ]);
      },
    };
    const reportOption = {
      label: '신고하기',
      icon: 'flag-outline',
      action: () => console.log('Report comment'),
    }
    const followOption = {
      label: '팔로우하기',
      icon: 'person-add-outline',
      action: () => console.log('Follow comment author'),
    }
    if (isAuthor) {
      menuOptions.push(editOption, deleteOption);
    } else {
      menuOptions.push(reportOption, followOption);
    }
    return menuOptions;
  }
}