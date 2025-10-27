import { z } from 'zod';
import { ChannelResponseSchema } from './channel.schema';

export type ChannelResponseDto = z.infer<typeof ChannelResponseSchema>;