import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

const FastToast = forwardRef((props: { bottomOffset?: number }, ref) => {
  const [message, setMessage] = useState('');
  const anim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    show: (msg: string) => {
      setMessage(msg);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }).start();
      
      timeoutRef.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setMessage(''));
      }, 700); // 0.7 seconds hold time as requested
    }
  }));

  if (!message) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: anim, bottom: props.bottomOffset || 80 }]} pointerEvents="none">
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 999, // Keeping this at 999 so it doesn't get hidden behind bottom sheets
    zIndex: 999999,
    maxWidth: '85%',
  },
  toastText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  }
});

export default FastToast;
