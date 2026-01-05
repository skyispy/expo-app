import { z } from 'zod';

export const InfiniteQueryRequestSchema = z.object({
  page: z
    .preprocess((v) => Number(v), z.number().min(1, '페이지는 1 이상이어야 합니다.'))
    .default(1),
  limit: z
    .preprocess(
      (v) => Number(v),
      z
        .number()
        .min(1, '한 페이지당 항목 수는 1 이상이어야 합니다.')
        .max(100, '한 페이지당 항목 수는 100 이하이어야 합니다.'),
    )
    .default(10),
});

export type InfiniteQueryRequestDto = z.infer<typeof InfiniteQueryRequestSchema>;
