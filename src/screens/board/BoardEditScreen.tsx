import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { AppRouteScreenProps, AppStackScreenProps } from '../../types';
import { FormInput } from '../../components';
import { Ionicons } from '@expo/vector-icons/';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCreateBoard, useImagePicker, useUpdateBoard } from '../../hooks';
import { BoardCreateSchema } from '../../schemas';
import { getDateTimeString } from '../../utils';
import { KeyboardLayout } from '../../layout';
import { useQueryClient } from '@tanstack/react-query';

export const BoardEditScreen = () => {
  // 수정할 게시글 정보 (없으면 새 글 작성)
  const route = useRoute<AppRouteScreenProps<'BoardEdit'>>();
  const board = route?.params?.board;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>(board?.title ?? '');
  const [content, setContent] = useState<string>(board?.content ?? '');
  const [contentHeight, setContentHeight] = useState<number>(0);

  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<AppStackScreenProps>();

  const { imageUri, pickImage, removeImage } = useImagePicker();

  // 안드로이드에서 TextInput의 contentSize 변경 감지 함수
  // iOS는 자동으로 높이 조절됨
  const contentSizeChange = (event: any) => {
    if (Platform.OS === 'android') {
      setContentHeight(event.nativeEvent.contentSize.height);
    }
  }

  const { createBoard } = useCreateBoard();
  const { updateBoard } = useUpdateBoard(board?.boardId ?? 0);
  // 저장 버튼 함수
  const saveBoard = useCallback(async () => {
    const { success, data, error } = BoardCreateSchema.safeParse({
      title,
      content,
      imageUrl: imageUri,
      category: 'free',
    });
    if (!success) {
      Alert.alert('입력 오류', error.message);
      return;
    }
    // formData로 변환
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);

    if (data.imageUrl) {
      // 20250929180700 날짜시간 문자열 생성
      const dateTimeString = getDateTimeString();
      // 이미지가 있을 때만 추가
      formData.append('thumbnailImage', {
        uri: data.imageUrl,
        name: 'thumbnail_' + dateTimeString + '.jpg',
        type: 'image/jpeg',
      } as any);
    }
    // 게시글 수정 or 생성
    if (board?.boardId) {
      const updateResult = await updateBoard(formData);
      if (!updateResult) {
        Alert.alert('게시글 수정 실패', '게시글 수정에 실패했습니다. 다시 시도해주세요.');
        return;
      }
      // 수정한 게시글 캐시 업데이트
      await queryClient.invalidateQueries({ queryKey: ['board', board.boardId] })
      await queryClient.invalidateQueries({ queryKey: ['boardList', board.category] })
      Alert.alert('게시글 수정 성공', '게시글이 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } else {
      await createBoard(formData);
      Alert.alert('게시글 생성 성공', '게시글이 생성되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    }
  }, [title, content, imageUri, createBoard, navigation]);

  // 헤더에 저장 버튼 추가
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={saveBoard}>
          <Text style={
            title.trim().length === 0 ?
              [styles.rightButtonText, { color: '#ccc' }]
              : styles.rightButtonText
          }>
            저장
          </Text>
        </Pressable>
      )
    })
  }, [navigation, saveBoard]);

  return (
    <KeyboardLayout>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{ paddingBottom: bottom, flexGrow: 1 }}
        nestedScrollEnabled={false}
        keyboardShouldPersistTaps="handled"
      >
        {board?.thumbnailImageUrl && !imageUri && (
          <>
            <Text style={{ fontSize: 18, marginBottom: 8}}>현재 썸네일 이미지</Text>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: board.thumbnailImageUrl }} />
            </View>
          </>
        )}
        {!imageUri ? (
          <TouchableOpacity style={styles.selectImageButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="black" />
            <Text style={styles.selectImageButtonText}>썸네일 이미지 선택</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: imageUri }} />
            <Pressable
              onPress={removeImage}
              style={styles.deleteImageButton}
            >
              <Ionicons name="trash-outline" size={24} color="black" />
            </Pressable>
          </View>
        )}
        <FormInput
          label="제목"
          labelStyle={styles.label}
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
          placeholder={'제목을 입력하세요(필수)'}
          placeholderTextColor="#888"
        />
        <FormInput
          label="내용"
          value={content}
          onChangeText={setContent}
          style={[
            styles.contentInput,
            { height: Platform.OS === 'android' ? contentHeight : undefined },
          ]}
          labelStyle={styles.label}
          onContentSizeChange={contentSizeChange}
          multiline
          placeholder={'내용을 입력하세요.'}
          scrollEnabled={false}
        />
      </ScrollView>
    </KeyboardLayout>
  );
}

const styles  = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 16,
  },
  selectImageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#eee',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteImageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: '50%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    fontSize: 16,
    marginBottom: 16,
    height: undefined
  },
  contentInput: {
    borderWidth: 0,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 200,
    height: undefined,
  },
  rightButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  }
})