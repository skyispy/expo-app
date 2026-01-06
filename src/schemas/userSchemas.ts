import { z } from 'zod';

// 회원가입 스키마
export const UserSignupSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .max(12, '닉네임은 12자 이내로 입력해주세요.'),
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(100, '비밀번호는 100자 이내로 입력해주세요.')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      }),
    confirmPassword: z.string(),
  })
  .required();

export type UserSignupFields = Partial<z.infer<typeof UserSignupSchema>>;
export type SignupRequest = Omit<z.infer<typeof UserSignupSchema>, 'confirmPassword'>;

// 로그인 스키마
export const UserLoginSchema = z
  .object({
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(100, '비밀번호는 100자 이내로 입력해주세요.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      ),
    keepLogin: z.boolean().optional().default(false),
  })
  .required();

export type LoginRequest = z.infer<typeof UserLoginSchema>;

// 프로필 수정 스키마
export const UserProfileUpdateSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .max(12, '닉네임은 12자 이내로 입력해주세요.'),
    introduction: z.string().max(35, '소개글은 35자 이내로 입력해주세요.').nullable(),
    profileImage: z.string().nullable(),
  })
  .required();

export type UserProfileUpdateFields = Partial<z.infer<typeof UserProfileUpdateSchema>>;
