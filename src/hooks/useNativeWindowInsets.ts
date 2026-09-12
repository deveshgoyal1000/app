import { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { NativeWindowInsets } = NativeModules;

export type InsetsMap = { top: number, bottom: number, left: number, right: number };
export type WindowInsetsState = {
  systemBars: InsetsMap;
  tappableElement: InsetsMap;
  systemGestures: InsetsMap;
  ime: InsetsMap;
  displayCutout: InsetsMap;
};

const defaultInsets: InsetsMap = { top: 0, bottom: 0, left: 0, right: 0 };
const defaultState: WindowInsetsState = {
  systemBars: defaultInsets,
  tappableElement: defaultInsets,
  systemGestures: defaultInsets,
  ime: defaultInsets,
  displayCutout: defaultInsets,
};

let cachedState: WindowInsetsState = defaultState;
const emitter = Platform.OS === 'android' && NativeWindowInsets ? new NativeEventEmitter(NativeWindowInsets) : null;

export function useNativeWindowInsets(): WindowInsetsState {
  const [insets, setInsets] = useState<WindowInsetsState>(cachedState);

  useEffect(() => {
    if (Platform.OS !== 'android' || !NativeWindowInsets) return;
    
    const sub = emitter?.addListener('onWindowInsetsChanged', (newState: WindowInsetsState) => {
      cachedState = newState;
      setInsets(newState);
    });

    NativeWindowInsets.startListening();

    return () => {
      sub?.remove();
    };
  }, []);

  return insets;
}
