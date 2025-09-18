export type User = {
  userId: number;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  introduction: string | null;
};

export type Board = {
  boardId: number;
  user: User;
  // 카테고리 (예: '공지사항', '자유게시판' 등)
  category: string;
  // 글 제목
  title: string;
  // 글 내용
  content: string;
  // 글 이미지 URL (nullable)
  imageUrl: string | null;
  // 조회수
  views: number;
  // 좋아요 수
  likes: number;
  // 게시글 상태 (예: 'active', 'inactive', 'deleted' 등)
  status: string;
  // 게시글 시작일과 종료일 (예: 이벤트 게시글의 경우)
  startDate: Date;
  endDate: Date;
  createDate: Date;
  updateDate: Date;
}