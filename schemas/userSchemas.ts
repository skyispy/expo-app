import { z } from "zod";

export const UserSignupSchema = z.object({
  username: z.string()
    .min(1, '이름을 입력해주세요.')
    .max(10, '이름은 10자 이내로 입력해주세요.'),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '이메일 형식이 올바르지 않습니다.'),
  password: z.string()
  .min(8, '비밀번호는 8자 이상 입력해주세요.')
  .max(100)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  }),
  confirmPassword: z.string(),
})
.required();

export type UserSignupFields = Partial<z.infer<typeof UserSignupSchema>>;