import { Pressable, ScrollView, StyleSheet, View, Text, Dimensions, TouchableHighlight } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SlideModalLayout } from '@layout';
import { useCategoryModalStore } from '@store';
import { useGetChannelList } from '@hooks';
import { useState } from 'react';

const { width, height } = Dimensions.get('window')

export const BoardCategoryModal = () => {
  const categoryModalStore = useCategoryModalStore();
  const [selectedChannelId, setSelectedChannelId] = useState<number>(categoryModalStore.channelId ?? 1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(categoryModalStore.categoryId ?? null);
  const { channelList } = useGetChannelList();
  const { top, bottom } = useSafeAreaInsets();
  // 선택된 채널의 카테고리 리스트
  const selectedCategoryList = channelList?.find(channel => channel.channelId === selectedChannelId)?.categoryList;
  return (
    <SlideModalLayout modalStore={categoryModalStore} title={'카테고리 선택'}>
      <View style={[styles.container, { height: height - top - 70 - 40 - bottom }]}>
        <ScrollView
          style={{ width: 60, borderWidth: 1 }}
        >
          {channelList &&
            channelList?.map((channel) => (
              <View
                key={channel.channelId}
                style={styles.channelContainer}
              >
                <Pressable
                  style={channel.channelId === selectedChannelId ? [styles.channelImageContainer, { borderWidth: 2, borderColor: 'blue' }] : styles.channelImageContainer}
                  onPress={() => setSelectedChannelId(channel.channelId)}
                >
                  <Image
                    source={{ uri: channel.channelImageUrl ?? undefined }}
                    placeholder={require('@assets/event2.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Pressable>
              </View>
            ))}
        </ScrollView>
        <ScrollView
          style={{ width: width - 120 }}
        >
          {selectedCategoryList && selectedCategoryList.map((category) => (
            <TouchableHighlight
              key={category.categoryId}
              underlayColor="#eee"
              onPress={() => {
                setSelectedCategoryId(category.categoryId);
              }}
              style={selectedCategoryId === category.categoryId ? { backgroundColor: '#ddd' } : {}}
            >
              <View style={{ borderBottomWidth: 1, height: 80, paddingHorizontal: 16, paddingTop: 12 }}>
                <Text style={styles.categoryName}>{category.categoryName}</Text>
                <Text style={styles.description}>{category.description}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[styles.bottomButton, { backgroundColor: selectedCategoryId === null ? '#dddddd' : '#6A49E9' }]}
          onPress={() => {
            categoryModalStore.setChannelId(selectedChannelId);
            categoryModalStore.setCategoryId(selectedCategoryId as number);
            categoryModalStore.hide();
          }}
          disabled={selectedCategoryId === null}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>선택 완료</Text>
        </Pressable>
      </View>
    </SlideModalLayout>
  );
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  channelContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  channelImageContainer: {
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bottomButtonContainer: {
    height: 60,
  },
  bottomButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})