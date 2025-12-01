import { Text, View, StyleSheet, InteractionManager } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '@types';

export const CustomLoading = () => {
  const navigation = useNavigation<AppStackScreenProps>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return navigation.addListener('transitionEnd', () => {
      setIsLoading(false);
    })
  }, [navigation]);

  return isLoading ? (
    <View style={styles.container}>
      <Text>로딩 중...</Text>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})