import { z } from 'zod';
import { UserResponseSchema } from '../../user/dto/user.schema';

// 댓글 조회 응답 스키마
export const CommentResponseSchema = z.object({
  commentId: z.number(),
  content: z.string().max(500, '댓글은 500자 이내로 입력해주세요.'),
  user: UserResponseSchema,
  boardId: z.number(),
  parentCommentId: z.number().nullable(),
  createDate: z.date(),
  updateDate: z.date(),
});
