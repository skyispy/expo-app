import { z } from 'zod';
import { CategoryResponseSchema } from '../../board/dto/category.schema';

export const ChannelResponseSchema: z.ZodObject = z.object({
  // 채널 ID
  channelId: z.number().min(1, '유효하지 않은 요청입니다.'),
  // 채널 이름
  channelName: z.string(),
  // 채널 설명
  description: z.string().nullable(),
  // 채널 이미지 URL
  channelImageUrl: z.string().url().nullable(),
  // 채널 상태
  status: z.string(),
  // 생성 일자
  createDate: z.date(),
  // 수정 일자
  updateDate: z.date(),
  // 삭제 일자
  deleteDate: z.date().nullable(),
  // 카테고리 목록
  categoryList: z.lazy(() => CategoryResponseSchema.array()).optional(),
});
