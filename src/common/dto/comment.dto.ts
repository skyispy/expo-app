import { z } from 'zod';
import { CommentResponseSchema, CommentCreateSchema } from './comment.schema';

export type CommentResponseDto = z.infer<typeof CommentResponseSchema>;

export type CommentCreateDto = z.infer<typeof CommentCreateSchema>;
