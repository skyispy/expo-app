import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  labelStyle?: TextInputProps['style'];
  inputWrapperStyle?: ViewProps['style'];
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  maxLength?: number;
}

export const FormInput = ({
  label,
  labelStyle,
  inputWrapperStyle,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  maxLength,
  ...props
}: FormInputProps) => {
  const { style: inputStyle, ...restProps } = props;
  return (
    <>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={[styles.inputContainer, inputWrapperStyle]}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          scrollEnabled={false}
          {...restProps}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {maxLength && <Text style={styles.charCountText}>{value.length} / {maxLength}자</Text>}
    </>
  )
};

interface FormInputWithButtonProps extends FormInputProps {
  buttonLabel: string;
  onButtonPress: () => void;
  disabled: boolean;
}

export const FormInputWithButton = ({
  label,
  labelStyle,
  inputWrapperStyle,
  value,
  onChangeText,
  error,
  buttonLabel,
  onButtonPress,
  disabled = false,
  ...props
}: FormInputWithButtonProps) => {
  const { style: inputStyle, ...restProps } = props;
  return (
    <>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }, inputWrapperStyle]}>
        <TextInput
          style={[styles.input, { flex: 1 }, inputStyle]}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          autoCapitalize="none"
          {...restProps}
        />
        <TouchableOpacity
          style={disabled ? [styles.button, { backgroundColor: 'gray', borderColor: 'gray' }] : styles.button}
          onPress={onButtonPress}
          disabled={disabled}
        >
          <Text style={disabled ? [styles.buttonText, { color: '#fff' }] : styles.buttonText}>
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </>
  )
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  errorContainer: {
    minHeight: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 2,
    fontSize: 12,
  },
  button: {
    minWidth: '20%',
    alignItems: 'center',
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6A49E9',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#6A49E9',
    fontWeight: 'bold',
    fontSize: 14,
  },
  charCountText: {
    alignSelf: 'flex-end',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
});
