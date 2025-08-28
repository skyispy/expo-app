import { z } from 'zod';

export const UserSignupSchema = z
  .object({
    username: z.string().min(1).max(100),
    email: z.string(),
    password: z
      .string()
      .min(8)
      .max(100)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
        message:
          'Password must contain at least one letter, one number, and one special character',
      }),
  })
  .required();

export type UserSignupDto = z.infer<typeof UserSignupSchema>;

export const UserLoginSchema = z
  .object({
    email: z.string(),
    password: z.string().min(8).max(100),
  })
  .required();

export type UserLoginDto = z.infer<typeof UserLoginSchema>;
