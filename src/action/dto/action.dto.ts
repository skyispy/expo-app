import { z } from 'zod';
import { BoardActionResponseSchema } from './action.schema';

export type BoardActionResponseDto = z.infer<typeof BoardActionResponseSchema>;
