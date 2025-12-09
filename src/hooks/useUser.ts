import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import {
  ApiResponse, Board, InfiniteQueryResponse,
  SignStackScreenProps,
  SignupRequest,
  User,
} from '@types';
import apiClient from '../api/config';
import { Alert } from 'react-native';
import { useAuthStore } from '@store';
import { ApiError } from '../errors/ApiError';
import { useNavigation } from '@react-navigation/native';

// 회원가입
export const useSignupUser = () => {
  const navigation = useNavigation<SignStackScreenProps>();
  const { mutateAsync } = useMutation({
    mutationFn: async (param: SignupRequest) => {
      const response = await apiClient.post('/user/signup', param);
      return response.data.result;
    },
    onSuccess: () => {
      Alert.alert('회원가입 완료', '로그인 해주세요.');
      navigation.navigate('Login');
    },
    onError: (error) => {
      if(error instanceof ApiError) {
        if (error.status === 409) {
          Alert.alert('회원가입 실패', `${error.message}`);
          return;
        }
      }
      Alert.alert('회원가입 실패', '요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  return { signupUser: mutateAsync };
};

// 닉네임 중복 확인
export const useCheckDuplicateNickname = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (nickname: string) => {
      const response: ApiResponse<boolean> = await apiClient.get('/user/check-nickname', {
          params: { nickname },
        },
      );
      return response.data.result;
    },
    onSuccess: (isDuplicate) => {
      Alert.alert('중복확인 완료', isDuplicate ? '이미 사용중인 닉네임입니다.' : '사용 가능한 닉네임입니다.');
    },
    onError: () => {
      Alert.alert('중복확인 실패', '요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  });

  return { nicknameCheck: mutateAsync };
};

// 프로필 수정
export const useUpdateProfile = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: FormData) => {
      const response: ApiResponse<User> = await apiClient.put('/user/profile', param, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.result;
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      Alert.alert('프로필 수정 완료', '프로필이 성공적으로 수정되었습니다.');
    },
    onError: (error) => {
      if(error instanceof ApiError) {
        if (error.status === 409) {
          Alert.alert('프로필 수정 실패', `${error.message}`);
          return;
        }
      }
      Alert.alert('프로필 수정 실패', '요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  });

  return { updateProfile: mutateAsync };
}

// 행동 기록 조회(게시글)
export const useGetBoardActionList = (actionType: string) => {
  const { data, refetch, isLoading } = useInfiniteQuery({
    queryKey: ['boardAction', { actionType }],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Board & { lastActionDate: Date }>>
        = await apiClient.get(`/action/board/${actionType}`, {
        params: { page: pageParam, limit: 20 },
      });
      return response.data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    // staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const boardList = data?.pages.flatMap(page => page.itemList);

  return { boardList: boardList, boardActionRefetch: refetch, boardActionIsLoading: isLoading };
}