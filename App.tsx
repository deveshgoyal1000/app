import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import WatchlistScreen from './src/screens/WatchlistScreen';
import PositionsScreen from './src/screens/PositionsScreen';
import HoldingsScreen from './src/screens/HoldingsScreen';
import FundsScreen from './src/screens/FundsScreen';

const Tab = createBottomTabNavigator();

export const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

function CustomSplashScreen({ onFinish }: { onFinish: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
          onFinish();
        });
      }, 1200);
    });
  }, []);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: opacityAnim }]}>
      <Animated.Image source={require('./assets/real-icon.png')} style={[styles.splashImage, { transform: [{ scale: scaleAnim }] }]} resizeMode="contain" />
    </Animated.View>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  
  // Explicitly calculate a thick bottom padding so it never hides behind the buttons
  const safeBottom = Math.max(insets.bottom, 20);
  const tabHeight = 50 + safeBottom;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      
      {/* Absolute top safe area block explicitly colored Teal */}
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'list';
              if (route.name === 'My List') iconName = focused ? 'bookmark' : 'bookmark-outline';
              else if (route.name === 'Positions') iconName = focused ? 'swap-vertical' : 'swap-vertical-outline';
              else if (route.name === 'Holdings') iconName = focused ? 'briefcase' : 'briefcase-outline';
              else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
              return <Ionicons name={iconName} size={22} color={color} />;
            },
            tabBarActiveTintColor: '#56328c',
            tabBarInactiveTintColor: '#888',
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
            tabBarStyle: { 
              paddingTop: 8, 
              paddingBottom: safeBottom, 
              height: tabHeight, 
              backgroundColor: '#ffffff', 
              borderTopWidth: 1, 
              borderTopColor: '#f0f0f0' 
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="My List" component={WatchlistScreen} />
          <Tab.Screen name="Positions" component={PositionsScreen} />
          <Tab.Screen name="Holdings" component={HoldingsScreen} />
          <Tab.Screen name="Account" component={FundsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
          <CustomSplashScreen onFinish={() => setShowSplash(false)} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: { justifyContent: 'center', alignItems: 'center' },
  splashImage: { width: 180, height: 180, borderRadius: 20 }
});

