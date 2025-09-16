import { useMutation, useQuery } from '@tanstack/react-query';
import { checkDuplicateNickname, signupUser, updateProfile } from '../api';
import { SignupRequest } from '../types';

// 회원가입
export const useSignupUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (param: SignupRequest) => signupUser(param),
  });

  return { signupUser: mutateAsync };
};

// 닉네임 중복 확인
export const useCheckDuplicateNickname = (nickname: string) => {
  const { refetch } = useQuery({
    queryKey: ['checkDuplicateNickname', nickname],
    queryFn: () => checkDuplicateNickname(nickname),
    enabled: false, // 자동 실행 방지, 수동으로 refetch 호출
    retry: false,
  });

  return { refetch };
};

// 프로필 수정
export const useUpdateProfile = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (param: FormData) => updateProfile(param),
  });

  return { updateProfile: mutateAsync };
}
