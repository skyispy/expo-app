import type { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Board } from './';

type StackScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList = keyof ParamList,
> = StackNavigationProp<ParamList, RouteName>;

type SignStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type SignStackScreenProps = StackScreenProps<SignStackParamList>;

// 바텀 탭 안에 있는 stack param 목록
type StackParamLists = {
  HomeStack: HomeStackParamList;
  BoardStack: BoardStackParamList;
  ProfileStack: ProfileStackParamList;
}

type TabParamList = {
  [K in keyof StackParamLists]: undefined | {
  screen: keyof StackParamLists[K];
  params?: StackParamLists[K][keyof StackParamLists[K]];
};
};

export type TabNavigationProps = BottomTabNavigationProp<TabParamList>;

type HomeStackParamList = {
  Home: undefined;
};

type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
};

type BoardStackParamList = {
  BoardList: undefined;
  Board: { board: Board };
}