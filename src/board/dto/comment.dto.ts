import { z } from 'zod';
import { CommentResponseSchema } from './comment.schema';

export type CommentResponseDto = z.infer<typeof CommentResponseSchema>;