import type { Board, User } from '../types/';

export const getBoardMenuOptions = (board: Board, user: User, navigation: any) => {
  const isAuthor = user?.userId === board.user.userId;
  return isAuthor ? [
    {
      label: '게시글 수정',
      icon: 'pencil-outline',
      action: () => navigation.navigate('BoardEdit', { board }),
    },
    {
      label: '게시글 삭제',
      icon: 'trash-outline',
      action: () => console.log('Delete post'),
    },
  ] : [
    {
      label: '신고하기',
      icon: 'flag-outline',
      action: () => console.log('Report post'),
    },
    {
      label: '게시글 공유',
      icon: 'share-social-outline',
      action: () => console.log('Share post'),
    },
    {
      label: '팔로우하기',
      icon: 'person-add-outline',
      action: () => console.log('Follow author'),
    },
  ];
}

export const getCommentMenuOptions = (commentUser: User, user: User) => {
  console.log(commentUser.userId, user.userId);
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