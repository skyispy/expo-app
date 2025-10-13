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
  thumbnailImageUrl: string | null;
  // 조회수
  views: number;
  // 좋아요 수
  likes: number;
  // 게시글 상태 (예: 'active', 'inactive', 'deleted' 등)
  status: string;
  // 게시글 시작일과 종료일 (예: 이벤트 게시글의 경우)
  startDate: string;
  endDate: string;
  createDate: string;
  updateDate: string;
  // 댓글 수
  commentCount: number;
}

export type Comment = {
  commentId: number;
  targetId: number; // 댓글이 달린 대상 ID
  targetType: string; // 댓글이 달린 대상 타입 (게시글 또는 댓글)
  user: User; // 댓글 작성자 정보
  content: string; // 댓글 내용
  likes: number; // 댓글 좋아요 수
  dislikes: number; // 댓글 싫어요 수
  status: string; // 댓글 상태 (예: 'active', 'deleted' 등)
  createDate: string; // 댓글 작성일
  updateDate: string; // 댓글 수정일
}