import { z } from 'zod';

// 게시판 생성 스키마
export const BoardCreateSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 최대 100자입니다.'),
  content: z.string(),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  imageUrl: z.url('Invalid image URL').nullable(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})