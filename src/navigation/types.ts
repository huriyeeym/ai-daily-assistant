import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  History: undefined;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Home'
>;

export type HistoryScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'History'
>;

export type HomeScreenRouteProp = RouteProp<RootTabParamList, 'Home'>;
export type HistoryScreenRouteProp = RouteProp<RootTabParamList, 'History'>;
