import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons/';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppRouteScreenProps, AppStackScreenProps, Board } from '@types';
import { CustomLoading, FormInput } from '@components';
import { useGetBoard, useImagePicker } from '@hooks';
import { KeyboardLayout } from '@layout';
import { useQueryClient } from '@tanstack/react-query';

export const BoardStep1Screen = () => {
  // 수정할 게시글 정보 (없으면 새 글 작성)
  const route = useRoute<AppRouteScreenProps<'BoardStep1'>>();
  const navigation = useNavigation<AppStackScreenProps>();
  const { bottom } = useSafeAreaInsets();
  const { imageUri, pickImage, removeImage } = useImagePicker();

  const boardId = route.params?.boardId;
  const { board, boardIsLoading } = useGetBoard(boardId);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return navigation.addListener('transitionEnd', () => {
      setIsLoading(false);
    })
  }, [navigation]);

  useEffect(() => {
    if (!boardIsLoading && board) {
      setTitle(board.title);
      setContent(board.content);
    }
  }, [boardIsLoading]);

  // 안드로이드에서 TextInput의 contentSize 변경 감지 함수
  // iOS는 자동으로 높이 조절됨
  const contentSizeChange = (event: any) => {
    if (Platform.OS === 'android') {
      setContentHeight(event.nativeEvent.contentSize.height);
    }
  }

  // 2단계로 이동
  const goToStep2 = useCallback(() => {
    const param = {
      ...board,
      title,
      content,
      imageUri,
    }
    navigation.navigate('BoardStep2', { board: param });
  }, [title, content, imageUri, navigation, board]);

  // 헤더에 저장 버튼 추가
  useEffect(() => {
    navigation.setOptions({
      headerTitle: board ? '게시글 수정 1 / 2' : '게시글 작성 1 / 2',
      headerRight: () => (
        <Pressable onPress={goToStep2}>
          <Text style={
            title.trim().length === 0 ?
              [styles.rightButtonText, { color: '#ccc' }]
              : styles.rightButtonText
          }>
            다음
          </Text>
        </Pressable>
      )
    })
  }, [goToStep2, navigation, title, board]);

  if (boardIsLoading || isLoading) return (
    <CustomLoading />
  );

  return (
    <KeyboardLayout>
      <ScrollView
        style={styles.container}
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