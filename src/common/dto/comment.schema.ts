import { z } from 'zod';
import { UserResponseSchema } from '../../user/dto/user.schema';

// 댓글 조회 응답 스키마
export const CommentResponseSchema = z.object({
  commentId: z.number(),
  targetId: z.number(),
  targetType: z.string(),
  user: UserResponseSchema,
  content: z.string().max(500, '댓글은 500자 이내로 입력해주세요.'),
  likes: z.number(),
  dislikes: z.number(),
  status: z.string(),
  children: z
    .array(z.lazy(() => CommentResponseSchema as z.ZodType<z.infer<typeof CommentResponseSchema>>))
    .optional(),
  createDate: z.date(),
  updateDate: z.date(),
});

// 댓글 생성 요청 스키마
export const CommentCreateSchema = z.object({
  content: z.string().max(500, '댓글은 500자 이내로 입력해주세요.'),
  targetId: z.number(),
  targetType: z.string(),
  parentCommentId: z.number().optional(),
});
