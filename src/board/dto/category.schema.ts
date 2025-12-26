import { z } from 'zod';
import { ChannelResponseSchema } from '../../channel/dto/channel.schema';

// 카테고리 응답 스키마 정의
export const CategoryResponseSchema: z.ZodObject = z.object({
  // 카테고리 ID
  categoryId: z.number().min(1, '유효하지 않은 요청입니다.'),
  // 카테고리 이름
  categoryName: z.string(),
  // 카테고리 설명
  description: z.string(),
  // 카테고리 상태
  status: z.string(),
  // 생성 일자
  createDate: z.date(),
  // 수정 일자
  updateDate: z.date(),
  // 채널
  channel: z.lazy(() => ChannelResponseSchema).optional(),
});
