import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNativeWindowInsets } from './useNativeWindowInsets';

export function useSystemBottomInset(): number {
  const safeAreaInsets = useSafeAreaInsets();
  const nativeInsets = useNativeWindowInsets();
  
  if (Platform.OS === 'ios') {
    return safeAreaInsets.bottom;
  }
  
  const tappable = nativeInsets.tappableElement.bottom;
  if (tappable > 0) return tappable;
  
  const gesture = nativeInsets.systemGestures.bottom;
  if (gesture > 0) return gesture;

  const systemBars = nativeInsets.systemBars.bottom;
  if (systemBars > 0) return systemBars;

  return safeAreaInsets.bottom;
}

export function useSystemAndImeBottomInset(): number {
  const safeAreaInsets = useSafeAreaInsets();
  const nativeInsets = useNativeWindowInsets();
  
  if (Platform.OS === 'ios') {
    return safeAreaInsets.bottom; // iOS handles IME via KeyboardAvoidingView natively usually
  }
  
  const navInset = useSystemBottomInset();
  const ime = nativeInsets.ime.bottom;
  
  // If the keyboard is shown, the IME inset overrides the navigation bar because it sits on top of it.
  return Math.max(navInset, ime);
}
