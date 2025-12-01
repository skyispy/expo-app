import { z } from 'zod';
import { BoardResponseSchema } from '../../board/dto/board.schema';

export const BoardActionResponseSchema = BoardResponseSchema.extend({
  lastActionDate: z.date().optional(),
});
