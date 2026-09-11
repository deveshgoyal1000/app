import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MarketSnackbar = forwardRef(({ bottomOffset = 70 }: { bottomOffset?: number }, ref) => {
  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
        setTimeout(() => {
          Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setVisible(false));
        }, 3000);
      });
    }
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.customSnackbar, {
      bottom: bottomOffset,
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
    }]}>
      <Ionicons name="time-outline" size={24} color="#fff" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.snackbarTitle}>Market is currently closed</Text>
        <Text style={styles.snackbarSub}>Please trade between 9:15 AM - 3:30 PM</Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  customSnackbar: { position: 'absolute', left: 16, right: 16, backgroundColor: '#262626', borderRadius: 8, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 10, zIndex: 99999 },
  snackbarTitle: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  snackbarSub: { color: '#bbb', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
});

export default MarketSnackbar;
