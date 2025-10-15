import { View, TextInput, Button, StyleSheet, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

type CommentInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export const CommentInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = '댓글을 입력하세요...',
}: CommentInputProps) => {
  const { bottom } = useSafeAreaInsets();
  const [bottomHeight, setBottomHeight] = useState(bottom);

  // 오프셋 설정
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setBottomHeight(0)
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setBottomHeight(bottom);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={[styles.container, { bottom: bottomHeight }]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
      <Button title="등록" onPress={onSubmit} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
});