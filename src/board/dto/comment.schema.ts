import { z } from 'zod';
import { UserResponseSchema } from '../../user/dto/user.schema';
import { BoardResponseSchema } from './board.schema';

// 댓글 조회 응답 스키마
export const CommentResponseSchema: z.ZodObject = z.object({
  commentId: z.number(),
  board: BoardResponseSchema.optional(),
  user: UserResponseSchema,
  content: z.string().max(500, '댓글은 500자 이내로 입력해주세요.'),
  status: z.string(),
  children: z
    .array(
      z.lazy(() =>
        CommentResponseSchema.omit({
          board: true,
          parent: true,
        }),
      ),
    )
    .optional(),
  parent: z.lazy(() =>
    CommentResponseSchema.omit({
      board: true,
    })
      .optional()
      .nullable(),
  ),
  createDate: z.date(),
  updateDate: z.date(),
  likes: z.number().optional(),
  isLiked: z.boolean().optional(),
});

export type CommentResponseDto = z.infer<typeof CommentResponseSchema>;

// 댓글 생성 요청 스키마
export const CommentCreateSchema = z.object({
  content: z.string().max(500, '댓글은 500자 이내로 입력해주세요.'),
  boardId: z.number(),
  parentCommentId: z.number().optional(),
});

export type CommentCreateDto = z.infer<typeof CommentCreateSchema>;
