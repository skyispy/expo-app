import type { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};

export type TabNavigationProps = BottomTabNavigationProp<TabParamList>;

type StackScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList = keyof ParamList,
> = StackNavigationProp<ParamList, RouteName>;

type SignStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type SignStackScreenProps = StackScreenProps<SignStackParamList>;

type HomeStackParamList = {
  Home: undefined;
};

export type HomeStackScreenProps = StackScreenProps<HomeStackParamList>;

type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
};

export type ProfileStackScreenProps = StackScreenProps<ProfileStackParamList>;
