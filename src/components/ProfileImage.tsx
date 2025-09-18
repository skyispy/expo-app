import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image, ImageProps } from 'expo-image';

interface ProfileImageProps extends ImageProps {
  uri: string | null | undefined;
  size: number;
  wrapperStyle?: ViewStyle;
}

export const ProfileImage = ({
  uri,
  size,
  wrapperStyle,
  ...props
}: ProfileImageProps) => {
  const defaultUserImage = require('@assets/user.png');
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        wrapperStyle
      ]}>
      <Image
        style={styles.profileImage}
        source={{ uri: `${uri}?t=${Date.now()}` }}
        cachePolicy={"none"}
        placeholder={defaultUserImage}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  }
})