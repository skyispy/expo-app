import { z } from 'zod';

export const UserSignupSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '닉네을 입력해주세요.')
      .max(12, '닉네임은 12자 이내로 입력해주세요.'),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '이메일 형식이 올바르지 않습니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(100, '비밀번호는 100자 이내로 입력해주세요.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      ),
  })
  .required();

export type UserSignupDto = z.infer<typeof UserSignupSchema>;

export const UserLoginSchema = z
  .object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '이메일 형식이 올바르지 않습니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(100, '비밀번호는 100자 이내로 입력해주세요.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      ),
    keepLogin: z.boolean().optional(),
  })
  .required();

export type UserLoginDto = z.infer<typeof UserLoginSchema>;
