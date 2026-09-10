import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Screens
import WatchlistScreen from './src/screens/WatchlistScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import FundsScreen from './src/screens/FundsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'list';

            if (route.name === 'My List') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else if (route.name === 'Trades') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Portfolio') {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },
          tabBarActiveTintColor: '#56328c', // Exact Upstox Purple
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 4,
          },
          tabBarStyle: {
            height: 60,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
          },
          headerShown: false, // Hide the default header to match exact UI
        })}
      >
        <Tab.Screen name="My List" component={WatchlistScreen} />
        <Tab.Screen name="Trades" component={OrdersScreen} />
        <Tab.Screen name="Portfolio" component={PortfolioScreen} />
        <Tab.Screen name="Account" component={FundsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
