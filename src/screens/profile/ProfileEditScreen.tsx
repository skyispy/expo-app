import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store';
import { useEffect, useState } from 'react';
import type { UserProfileUpdateFields } from '../../schemas';
import { UserProfileUpdateSchema } from '../../schemas';
import * as ImagePicker from 'expo-image-picker';
import { useCheckDuplicateNickname, useUpdateProfile } from '../../hooks';
import { User } from '../../types';
import { ProfileImage } from '@components/common';
import { FormInput, FormInputWithButton } from '@components/sign';

export const ProfileEditScreen = () => {
  const { user, setUser } = useAuthStore((state) => state);
  const [nickname, setNickname] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(true);
  // 각 필드별 에러 상태
  const [errors, setErrors] = useState<UserProfileUpdateFields>({});

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setIntroduction(user.introduction ?? '');
    }
  }, [user])

  // zod schema 검증 함수
  const validate = (fieldName: keyof UserProfileUpdateFields, value: string): boolean => {
    let errorMessage = '';

    // 1. Zod 스키마의 해당 필드 검증
    const filedSchema = UserProfileUpdateSchema.shape[fieldName];
    const result = filedSchema.safeParse(value);
    if (!result.success) {
      errorMessage = result.error.issues[0].message;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));

    return errorMessage === '';
  };

  // 이미지 선택 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // 'images' | 'videos' | 'livePhotos'
      quality: 1,
      allowsEditing: true,
    });
    if(!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  // 프로필 수정
  const { updateProfile } = useUpdateProfile();
  const handleUpdateProfile = async () => {
    // 1. Zod 스키마의 해당 필드 검증
    const result = UserProfileUpdateSchema.safeParse({
      nickname,
      introduction,
      profileImage: selectedImage,
    });
    if (!result.success) {
      Alert.alert('입력 오류', result.error.issues[0].message);
    }

    const formData = new FormData();
    formData.append('userId', (user as User).userId.toString())
    formData.append('nickname', nickname);
    formData.append('introduction', introduction);
    if(selectedImage) {
      formData.append('profileImage', {
        uri: selectedImage,
        name: 'profile_' + user?.userId + ".jpg",
        type: 'image/jpeg',
      } as any)
    }

    await updateProfile(formData, {
      onSuccess: (data) => {
        if(data) {
          setUser(data.user);
          Alert.alert('프로필 수정 완료', '프로필이 성공적으로 수정되었습니다.');
          // 이미지 선택 초기화 -> 버튼 비활성화
          setSelectedImage(null);
        } else throw new Error('프로필 수정에 실패했습니다.');
      },
      onError: (error) => {
        Alert.alert('프로필 수정 실패', `${error.message}`);
      }
    })
  }

  // 닉네임 중복확인
  const { nicknameCheck, nicknameCheckResult, nicknameCheckError } = useCheckDuplicateNickname(nickname);
  const handleCheckDuplicateNickname = async () => {
    if (!validate('nickname', nickname)) {
      Alert.alert('닉네임 오류', '닉네임을 올바르게 입력해주세요.');
      return;
    }
    await nicknameCheck();
    if (nicknameCheckError) {
      Alert.alert('중복확인 실패', nicknameCheckError.message);
      return;
    }
    if (!nicknameCheckResult) {
      Alert.alert('중복확인 실패', '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    Alert.alert(
      '중복확인 완료',
      nicknameCheckResult.isDuplicate ? '이미 사용중인 닉네임입니다.' : '사용 가능한 닉네임입니다.'
    );
    setIsNicknameChecked(!nicknameCheckResult.isDuplicate);
  };

  // 저장 버튼 활성화 여부
  // 닉네임이 변경되었고, 중복확인이 되어야 활성화
  // 자기소개가 변경되었거나, 이미지가 변경되었을 때 활성화
  const isSaveEnabled = (
    (nickname !== user?.nickname && isNicknameChecked) ||
    introduction !== (user?.introduction ?? '') ||
    selectedImage !== null
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileImageButton} onPress={pickImage}>
        <ProfileImage
          size={80}
          uri={selectedImage ?? user?.profileImageUrl}
        />
      </TouchableOpacity>
      <FormInputWithButton
        label="닉네임"
        value={nickname}
        onChangeText={(text: string) => {
          setNickname(text);
          validate('nickname', text);
          setIsNicknameChecked(text === user?.nickname);
        }}
        error={errors.nickname}
        buttonLabel={isNicknameChecked ? '완료' : '중복확인'}
        onButtonPress={handleCheckDuplicateNickname}
        disabled={isNicknameChecked}
        style={[styles.textarea, { flex: 1 }]}
      />
      <FormInput
        label="자기소개"
        value={introduction}
        onChangeText={(text) => {
          if(validate('introduction', text)) {
            setIntroduction(text);
          }
        }}
        style={[styles.textarea, { height: 100, textAlignVertical: 'top' }]}
        multiline={true}
        numberOfLines={4}
        placeholder="자신을 알릴 수 있는 소개글을 작성해 주세요."
        placeholderTextColor="#999999"
        maxLength={35}
      />
      <TouchableOpacity
        style={isSaveEnabled ? styles.button : [styles.button, { backgroundColor: 'gray' }]}
        onPress={handleUpdateProfile}
        disabled={!isSaveEnabled}
      >
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#fff',
    gap: 12,
  },
  profileImageButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginTop: 20
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  textarea: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    marginTop: 6,
    paddingLeft: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  charCountText: {
    alignSelf: 'flex-end',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#6A49E9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
