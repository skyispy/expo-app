// 게시판 관련 공통 타입 정의
export type BoardAction = 'view' | 'like' | 'hide';

// 정렬 순서 타입 정의
export type SortOrder = 'latest' | 'oldest';

// 메뉴 옵션 타입 정의
export type MenuOption = {
  icon: string;
  label: string;
  action: () => void;
};