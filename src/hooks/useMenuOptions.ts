import { AppStackScreenProps, Board, Comment, User } from '@types';
import { useNavigation } from '@react-navigation/native';
import { Alert, TextInput } from 'react-native';
import { useDeleteBoard } from './useBoard';
import { useQueryClient } from '@tanstack/react-query';
import { RefObject } from 'react';
import { useCommentInputStore } from '@store';

export const useBoardMenuOptions = (board: Board | undefined, user: User) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<AppStackScreenProps>();
  const { deleteBoard } = useDeleteBoard(board?.boardId ?? 0);
  const isAuthor = user.userId === board?.user.userId;
  return isAuthor
    ? [
        {
          label: '게시글 수정',
          icon: 'pencil-outline',
          action: () => {
            navigation.navigate('BoardStep1', { board });
          },
        },
        {
          label: '게시글 삭제',
          icon: 'trash-outline',
          action: () => {
            Alert.alert('게시글 삭제', '정말로 게시글을 삭제하시겠습니까?', [
              { text: '취소', style: 'cancel' },
              {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                  await deleteBoard();
                  await queryClient.invalidateQueries({ queryKey: ['board', board?.category] });
                  Alert.alert('게시글 삭제 성공', '게시글이 삭제되었습니다.', [
                    {
                      text: '확인',
                      onPress: async () => {
                        navigation.replace('Main', { screen: 'BoardList' });
                        await queryClient.invalidateQueries({ queryKey: ['board', board?.boardId] });
                      },
                    },
                  ]);
                },
              },
            ]);
          }
        }
      ]
    : [
        {
          label: '신고하기',
          icon: 'flag-outline',
          action: () => console.log(''),
        },
        {
          label: '게시글 공유',
          icon: 'share-social-outline',
          action: () => console.log(''),
        },
        {
          label: '팔로우하기',
          icon: 'person-add-outline',
          action: () => console.log(''),
        },
      ];
}

export const useCommentMenuOptions = (user: User, commentInputRef?: RefObject<TextInput | null>) => {
  const { setMode, setValue, setParentCommentId, setCommentId, setHeaderText } = useCommentInputStore();
  return (comment: Comment) => {
    const isAuthor = user?.userId === comment.user.userId;
    return isAuthor
      ? [
          {
            label: '댓글 수정',
            icon: 'pencil-outline',
            action: () => {
              if (commentInputRef?.current) {
                setMode('edit');
                setValue(comment.content);
                setCommentId(comment.commentId);
                setHeaderText("댓글 입력");
                commentInputRef.current.focus();
              }
            },
          },
          {
            label: '댓글 삭제',
            icon: 'trash-outline',
            action: () => console.log('Delete comment'),
          },
        ]
      : [
          {
            label: '신고하기',
            icon: 'flag-outline',
            action: () => console.log('Report comment'),
          },
          {
            label: '팔로우하기',
            icon: 'person-add-outline',
            action: () => console.log('Follow comment author'),
          },
        ];
  }
}