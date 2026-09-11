import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

// Screens
import WatchlistScreen from './src/screens/WatchlistScreen';
import PositionsScreen from './src/screens/PositionsScreen';
import HoldingsScreen from './src/screens/HoldingsScreen';
import FundsScreen from './src/screens/FundsScreen';

const Tab = createBottomTabNavigator();

// Export font family name for use across screens
export const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Splash Screen Animation Component
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" translucent={true} backgroundColor="transparent" />
        <CustomSplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" translucent={true} backgroundColor="transparent" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'list';

              if (route.name === 'My List') {
                iconName = focused ? 'bookmark' : 'bookmark-outline';
              } else if (route.name === 'Positions') {
                iconName = focused ? 'swap-vertical' : 'swap-vertical-outline';
              } else if (route.name === 'Holdings') {
                iconName = focused ? 'briefcase' : 'briefcase-outline';
              } else if (route.name === 'Account') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={22} color={color} />;
            },
            tabBarActiveTintColor: '#56328c',
            tabBarInactiveTintColor: '#888',
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
            tabBarStyle: { paddingTop: 8, paddingBottom: 8, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
            headerShown: false,
          })}
        >
          <Tab.Screen name="My List" component={WatchlistScreen} />
          <Tab.Screen name="Positions" component={PositionsScreen} />
          <Tab.Screen name="Holdings" component={HoldingsScreen} />
          <Tab.Screen name="Account" component={FundsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { justifyContent: 'center', alignItems: 'center' },
  splashImage: { width: 180, height: 180, borderRadius: 20 }
});







