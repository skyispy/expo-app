import { BoardCategoryModal } from '@screens/board/components/BoardCategoryModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppRouteScreenProps, AppStackScreenProps } from '@types';
import { Alert, Pressable, Text, View, StyleSheet } from 'react-native';
import { useCallback, useEffect } from 'react';
import { useCreateBoard, useGetChannelList, useUpdateBoard } from '@hooks';
import { BoardCreateSchema } from '@schemas';
import { getDateTimeString } from '@utils';
import { useCategoryModalStore } from '@store';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons/';

export const BoardStep2Screen = () => {
  const route = useRoute<AppRouteScreenProps<'BoardStep2'>>();
  const navigation = useNavigation<AppStackScreenProps>();
  const queryClient = useQueryClient();
  const { board } = route.params;
  const { createBoard } = useCreateBoard();
  const { updateBoard } = useUpdateBoard('boardId' in board ? board.boardId : 0);
  const { channelList } = useGetChannelList();

  const { categoryId, setCategoryId, show: showCategoryModal, clear: clearCategoryStore } = useCategoryModalStore();

  useEffect(() => {
    if(categoryId === undefined && 'category' in board) {
    // 수정 모드일 때는 기존 카테고리 id로 설정
      setCategoryId(board.category.categoryId);
    } else {
      clearCategoryStore();
    }
  }, []);

  // 저장 버튼 함수
  const saveBoard = useCallback(async () => {
    const { success, data, error } = BoardCreateSchema.safeParse({
      title: board.title,
      content: board.content,
      categoryId,
      imageUrl: board.imageUri,
    });
    if (!success) {
      Alert.alert('입력 오류', error.message);
      return;
    }
    // formData로 변환
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('categoryId', data.categoryId.toString());

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
    if ('boardId' in board) {
      // 수정
      await updateBoard(formData);
      // 수정한 게시글 상세 캐시 업데이트
      await queryClient.invalidateQueries({ queryKey: ['board', { boardId: board.boardId }] })
      // 게시판 목록 캐시 업데이트
      await queryClient.invalidateQueries({ queryKey: ['board', { categoryId: categoryId }] });
      if(board.category.categoryId !== categoryId) {
        // 카테고리 변경 시
        // 이전 카테고리 캐시도 업데이트
        await queryClient.invalidateQueries({ queryKey: ['board', { categoryId: board.category.categoryId }] })
      }
      Alert.alert('게시글 수정 성공', '게시글이 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } else {
      // 생성
      await createBoard(formData);
      Alert.alert('게시글 생성 성공', '게시글이 생성되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    }
  }, [categoryId, board, createBoard, updateBoard, navigation, queryClient]);

  // 헤더에 저장 버튼 추가
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={saveBoard}>
          <Text style={
            categoryId === undefined ?
              [styles.rightButtonText, { color: '#ccc' }]
              : styles.rightButtonText
          }>
            확인
          </Text>
        </Pressable>
      )
    })
  }, [saveBoard, navigation, categoryId]);

  // 채널리스트에서 카테고리 id로 채널명이랑 카테고리 명 찾기
  // 선택된 채널
  const selectedChannel = channelList?.find(channel =>
    channel.categoryList?.some(category => category.categoryId === categoryId)
  );
  // 선택된 카테고리
  const selectedCategory = selectedChannel?.categoryList?.find(category => category.categoryId === categoryId);
  return (
    <>
      <BoardCategoryModal />
      <View style={styles.container}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>카테고리 선택(필수)*</Text>
          <View style={styles.selectButtonContainer}>
            <Pressable style={styles.selectButton} onPress={showCategoryModal}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.icon}
                  source={{ uri: selectedChannel?.channelImageUrl ?? undefined }}
                />
              </View>
              <Text style={styles.selectButtonText} ellipsizeMode={'tail'} numberOfLines={1}>
                {selectedChannel?.channelName}
              </Text>
              <Ionicons name="chevron-down" size={16} color="black" style={styles.downIcon} />
            </Pressable>
            <View style={styles.separator} />
            <Pressable style={styles.selectButton} onPress={showCategoryModal}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.icon}
                />
              </View>
              <Text style={styles.selectButtonText}>{selectedCategory?.categoryName}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rightButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  selectButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  selectButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 20,
    height: 20,
    overflow: 'hidden',
    marginRight: 4,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  selectButtonText: {
    width: '70%',
    fontSize: 14,
    color: '#333',
  },
  downIcon: {
    position: 'absolute',
    right: 12,
    top: '30%',
  },
  separator: {
    width: 8,
    height: 1,
    backgroundColor: 'black',
  }
})