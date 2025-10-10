import type { Board, User } from '../types/';

export const getMenuOptions = (board: Board, user: User, navigation: any) => {
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