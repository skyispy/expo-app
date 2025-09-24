import { z } from 'zod';
import { UserResponseSchema } from '../../user/dto/user.schema';

// 게시판 조회 응답 스키마
export const BoardResponseSchema = z.object({
  boardId: z.number().min(1),
  user: UserResponseSchema.optional(),
  // 카테고리 (예: '공지사항', '자유게시판' 등)
  category: z.string(),
  // 글 제목
  title: z.string(),
  // 글 내용
  content: z.string(),
  // 글 이미지 URL (nullable)
  imageUrl: z.url().nullable(),
  // 조회수
  views: z.number(),
  // 좋아요 수
  likes: z.number(),
  // 게시글 상태 (예: 'active', 'inactive', 'deleted' 등)
  status: z.string(),
  // 게시글 시작일과 종료일 (예: 이벤트 게시글의 경우)
  startDate: z.date(),
  endDate: z.date(),
  createDate: z.date(),
  updateDate: z.date(),
  // 댓글 수
  commentCount: z.number().optional(),
});

// 게시판 생성 요청 스키마
export const BoardCreateSchema = z.object({
  // 카테고리 (예: '공지사항', '자유게시판' 등)
  category: z.string().min(1, 'Category is required'),
  // 글 제목
  title: z.string().min(1, 'Title is required'),
  // 글 내용
  content: z.string().min(1, 'Content is required'),
  // 글 이미지 URL (nullable)
  imageUrl: z.url().optional(),
  // 게시글 시작일과 종료일 (예: 이벤트 게시글의 경우)
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
