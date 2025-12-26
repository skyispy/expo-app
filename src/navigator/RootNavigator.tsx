import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import SignStackNavigator from './SignStackNavigator';
import { useAuthStore } from '@store';
import { useTokenLoginUser } from '@hooks';
import { BottomBackground } from '@layout';

const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const { tokenLoginUser, isTokenLoginPending } = useTokenLoginUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user === null) {
      // 자동 로그인 시도
      tokenLoginUser();
    }
  }, []);

  useEffect(() => {
    if (isTokenLoginPending) {
      setIsLoading(true);
    } else {
      // 토큰 검증이 끝나면 0.5초 후에 로딩 해제
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTokenLoginPending]);

  // 로딩 화면
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {/* 바텀 내비게이션 바 백그라운드 컴포넌트 */}
      <BottomBackground />
      {user ? <AppNavigator /> : <SignStackNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
