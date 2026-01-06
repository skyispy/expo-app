import { View, TextInput, StyleSheet, Keyboard, Alert, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefObject, useEffect, useState } from 'react';
import { useCreateComment, useUpdateComment } from '@hooks';
import { CommentCreateSchema, CommentUpdateSchema } from '@schemas';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons/';
import { CommentMode } from '@types';

type CommentInputProps = {
  boardId: number;
  ref?: RefObject<TextInput | null>;
  mode: CommentMode;
  value: string;
  setValue: (value: string) => void;
  targetCommentId: number | null;
  headerText: string | null;
  clear: () => void;
};

export const CommentInput = ({
  boardId,
  ref,
  mode,
  value,
  setValue,
  targetCommentId,
  headerText,
  clear,
}: CommentInputProps) => {
  const queryClient = useQueryClient();

  const { bottom } = useSafeAreaInsets();
  const [bottomHeight, setBottomHeight] = useState(bottom);

  // 버튼 타이틀 설정
  const title = mode === 'create' ? '작성' : mode === 'edit' ? '수정' : '작성';

  const { createComment } = useCreateComment();
  const { updateComment } = useUpdateComment();

  const onSubmit = async () => {
    if (mode === 'create') {
      // 댓글 등록
      const param = {
        content: value,
        boardId,
      };
      const { success, data, error } = CommentCreateSchema.safeParse(param);
      if (!success) {
        Alert.alert('댓글 작성 실패', error.issues[0].message);
        return;
      }
      await createComment(data);
      Alert.alert('댓글 작성 성공', '댓글이 작성되었습니다.', [
        {
          text: '확인',
          onPress: async () => {
            await queryClient.invalidateQueries({
              queryKey: ['commentList', { boardId }],
            });
            clear();
          },
        },
      ]);
    } else if (mode === 'edit') {
      // 댓글 수정
      const { success, data, error } = CommentUpdateSchema.safeParse({
        content: value,
        targetCommentId,
      });
      if (!success) {
        Alert.alert('댓글 수정 실패', error.issues[0].message);
        return;
      }
      if (!targetCommentId) {
        Alert.alert('댓글 수정 실패', '수정할 댓글이 선택되지 않았습니다.');
        return;
      }
      await updateComment(data);
      Alert.alert('댓글 수정 성공', '댓글이 수정되었습니다.', [
        {
          text: '확인',
          onPress: async () => {
            await queryClient.invalidateQueries({
              queryKey: ['commentList', { boardId }],
            });
            clear();
          },
        },
      ]);
    } else if (mode === 'reply') {
      // 대댓글 등록
      const param = {
        content: value,
        boardId,
        targetCommentId,
      };
      const { success, data, error } = CommentCreateSchema.safeParse(param);
      if (!success) {
        Alert.alert('대댓글 작성 실패', error.issues[0].message);
        return;
      }
      await createComment(data);
      Alert.alert('대댓글 작성 성공', '대댓글이 작성되었습니다.', [
        {
          text: '확인',
          onPress: async () => {
            await queryClient.invalidateQueries({
              queryKey: ['commentList', { boardId }],
            });
            clear();
          },
        },
      ]);
    }
  };

  // 오프셋 설정
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setBottomHeight(0);
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
      {headerText && (
        <View style={styles.header}>
          <Text style={styles.headerText}>{headerText}</Text>
          <Pressable onPress={clear}>
            <Ionicons name={'close'} size={24} color={'black'} />
          </Pressable>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={'댓글을 입력하세요...'}
        />
        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
