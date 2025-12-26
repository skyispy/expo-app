export type User = {
  // 사용자 ID
  userId: number;
  // 닉네임
  nickname: string;
  // 이메일
  email: string;
  // 프로필 사진 URL (nullable)
  profileImageUrl: string | null;
  // 자기소개 (nullable)
  introduction: string | null;
};

export type Channel = {
  // 채널 ID
  channelId: number;
  // 채널 이름
  channelName: string;
  // 채널 설명
  description: string;
  // 채널 이미지 url (nullable)
  channelImageUrl: string | null;
  // 생성 일시
  createDate: string;
  // 수정 일시
  updateDate: string;
  // 삭제 일시
  deleteDate: string | null;
  // 카테고리 목록
  categoryList?: Category[];
};

export type Category = {
  // 카테고리 ID
  categoryId: number;
  // 카테고리 이름
  categoryName: string;
  // 카테고리 설명
  description: string;
  // 카테고리 상태 (예: 'active', 'inactive' 등)
  status: string;
  // 생성 일시
  createDate: string;
  // 수정 일시
  updateDate: string;
  // 삭제 일시
  deleteDate: string | null;
  // 소속 채널 정보 (nullable)
  channel?: Channel | null;
};

export type Board = {
  // 게시글 ID
  boardId: number;
  // 작성자 정보
  user: User;
  // 카테고리 (예: '공지사항', '자유게시판' 등)
  category: Category;
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
  // 좋아요 여부
  isLiked: boolean;
  // 게시 상태 (예: 'active', 'inactive', 'deleted' 등)
  status: string;
  // 게시 시작일 (예: 이벤트 게시의 경우)
  startDate: string;
  // 게시 종료일 (예: 이벤트 게시의 경우)
  endDate: string;
  // 생성 일시
  createDate: string;
  // 수정 일시
  updateDate: string;
  // 삭제 일시
  deleteDate: string | null;
  // 댓글 수
  commentCount: number;
  // 숨김 여부 (서버에서 가져올 때는 없음)
  isHidden?: boolean;
};

export type Comment = {
  // 댓글 ID
  commentId: number;
  // 대상 타입 (예: 'board', 'post' 등)
  targetType: string;
  // 대상 ID
  targetId: number;
  // 댓글 작성자 정보
  user: User;
  // 댓글 내용
  content: string;
  // 댓글 상태 (예: 'active', 'deleted' 등)
  status: string;
  // 대댓글
  children?: Comment[];
  // 부모 댓글
  parent?: Comment | null;
  // 생성 일시
  createDate: string;
  // 수정 일시
  updateDate: string;
  // 삭제 일시
  deleteDate: string | null;
};
