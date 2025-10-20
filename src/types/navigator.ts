import type { StackNavigationProp } from '@react-navigation/stack';
import { Board } from './model';
import { RouteProp } from '@react-navigation/native';

type StackScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList = keyof ParamList,
> = StackNavigationProp<ParamList, RouteName>;

// 로그인, 회원가입
type SignStackParamList = {
  Login: undefined;
  Signup: undefined;
};
export type SignStackScreenProps = StackScreenProps<SignStackParamList>;

// 메인 탭
export type MainTabParamList = {
  Home: undefined;
  BoardList: undefined;
  Notification: undefined;
  Profile: undefined;
}

// 메인
export type AppStackParamList = {
  Main: { screen: keyof MainTabParamList };
  Home: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  BoardList: undefined;
  Board: { boardId: number };
  BoardEdit: { board?: Board };
};
export type AppStackScreenProps = StackScreenProps<AppStackParamList>;

export type AppRouteScreenProps<RouteName extends keyof AppStackParamList>
  = RouteProp<AppStackParamList, RouteName>;