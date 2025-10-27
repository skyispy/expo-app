import { z } from 'zod';
import { BoardCreateSchema, BoardResponseSchema } from './board.schema';

// 게시판 조회 응답 dto
export type BoardResponseDto = z.infer<typeof BoardResponseSchema>;

// 게시판 생성 dto
export type BoardCreateDto = z.infer<typeof BoardCreateSchema>;
