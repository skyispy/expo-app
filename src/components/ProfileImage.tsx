import { StyleSheet, ViewStyle, Pressable } from 'react-native';
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
  const { style: imageStyle, ...restProps } = props;
  return (
    <Pressable
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        wrapperStyle
      ]}>
        <Image
          style={[styles.profileImage, imageStyle]}
          source={uri ? { uri } : null}
          cachePolicy={"none"}
          placeholder={defaultUserImage}
          transition={300}
          {...restProps}
        />
    </Pressable>
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