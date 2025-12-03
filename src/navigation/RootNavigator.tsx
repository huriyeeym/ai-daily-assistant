import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks';
import { RootTabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme as any}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'History':
                iconName = focused ? 'history' : 'history';
                break;
              case 'Statistics':
                iconName = focused ? 'chart-box' : 'chart-box-outline';
                break;
              default:
                iconName = 'help';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Daily Entry' }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'History' }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ title: 'Statistics' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
