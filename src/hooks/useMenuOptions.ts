import { AppStackScreenProps, Board, User } from '../types';
import { useNavigation } from '@react-navigation/native';

export const useBoardMenuOptions = (board: Board | undefined, user: User) => {
  const isAuthor = user.userId === board?.user.userId;
  const navigation = useNavigation<AppStackScreenProps>();
  return isAuthor ? [
    {
      label: '게시글 수정',
      icon: 'pencil-outline',
      action: () => {
        navigation.navigate('BoardEdit', { board })
      },
    },
    {
      label: '게시글 삭제',
      icon: 'trash-outline',
      action: () => console.log(""),
    },
  ] : [
    {
      label: '신고하기',
      icon: 'flag-outline',
      action: () => console.log(""),
    },
    {
      label: '게시글 공유',
      icon: 'share-social-outline',
      action: () => console.log(""),
    },
    {
      label: '팔로우하기',
      icon: 'person-add-outline',
      action: () => console.log(""),
    },
  ];
}

export const useCommentMenuOptions = (commentUser: User, user: User) => {
  const isAuthor = user?.userId === commentUser.userId;
  return isAuthor ? [
    {
      label: '댓글 수정',
      icon: 'pencil-outline',
      action: () => console.log('Edit comment'),
    },
    {
      label: '댓글 삭제',
      icon: 'trash-outline',
      action: () => console.log('Delete comment'),
    },
  ] : [
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