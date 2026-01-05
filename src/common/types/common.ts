export interface UserPayload {
  userId: number; // 사용자 ID
  nickname: string; // 사용자 이름
  email: string; // 사용자 이메일
  iat: number; // 발급 시간
  exp: number; // 만료 시간
}

export type BoardActionType = 'view' | 'like' | 'hide';

export type BoardExtraInfo = {
  commentCount: number;
  views: number;
  likes: number;
  isLiked: boolean;
  isHidden: boolean;
};

export type SortOrder = 'latest' | 'oldest';

export type CommentExtraInfo = {
  likes: number;
  isLiked: boolean;
};
