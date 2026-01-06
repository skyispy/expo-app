import { z } from 'zod';

// 게시글 생성 스키마
export const BoardCreateSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 최대 100자입니다.'),
  content: z.string(),
  categoryId: z.number().min(1, '카테고리를 선택해주세요.'),
  imageUrl: z.url('Invalid image URL').nullable(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// 댓글 생성 스키마
export const CommentCreateSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요.').max(500, '댓글은 최대 500자입니다.'),
  boardId: z.number().min(1, '유효한 게시글 ID가 필요합니다.'),
  targetCommentId: z.number().optional(),
});

// 댓글 수정 스키마
export const CommentUpdateSchema = CommentCreateSchema.omit({
  boardId: true,
})

export type CommentUpdateRequest = z.infer<typeof CommentUpdateSchema>;