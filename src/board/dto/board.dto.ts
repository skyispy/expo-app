import { z } from 'zod';
import { BoardResponseSchema } from './board.schema';

export type BoardResponseDto = z.infer<typeof BoardResponseSchema>;
