import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks';
import { RootTabParamList } from './types';
import { THEME_COLORS, GRADIENT_COLORS } from '../constants';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme as any}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'History':
                iconName = focused ? 'book-clock' : 'book-clock-outline';
                break;
              default:
                iconName = 'help';
            }

            return (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon
                  name={iconName}
                  size={24}
                  color={focused ? THEME_COLORS.primary : THEME_COLORS.textSecondary}
                />
              </View>
            );
          },
          tabBarActiveTintColor: '#6B5DD3',
          tabBarInactiveTintColor: '#8B7E99',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(200, 185, 255, 0.15)',
            elevation: 12,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
            paddingTop: 10,
            shadowColor: 'rgba(139, 126, 232, 0.4)',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 1,
            shadowRadius: 16,
            backdropFilter: 'blur(10px)',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'History' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 34,
    borderRadius: 18,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(232, 213, 247, 0.8)', // Soft pastel purple badge
  },
});

export default RootNavigator;
