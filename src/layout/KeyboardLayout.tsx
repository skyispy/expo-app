import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { ReactNode, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

export const KeyboardLayout = ({ children }: { children: ReactNode }) => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  // 오프셋 설정
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOffset(70);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}