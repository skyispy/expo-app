import type { StackNavigationProp } from '@react-navigation/stack';
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

export type AppStackParamList = {
  Main: undefined;
  Home: undefined;
  Profile: undefined;
  BoardList: undefined;
  ProfileEdit: undefined;
  Board: { board: Board };
}

export type AppStackScreenProps = StackScreenProps<AppStackParamList>;