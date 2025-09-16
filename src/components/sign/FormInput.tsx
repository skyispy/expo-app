import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const FormInput = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  ...props
}: FormInputProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        secureTextEntry={secureTextEntry}
        {...props}
      />
    </View>
    {error && (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )}
  </View>
);

interface FormInputWithButtonProps extends FormInputProps {
  buttonLabel: string;
  onButtonPress: () => void;
  disabled: boolean;
}

export const FormInputWithButton = ({
  label,
  value,
  onChangeText,
  error,
  buttonLabel,
  onButtonPress,
  disabled = false,
  ...props
}: FormInputWithButtonProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        editable={!disabled}
        {...props}
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
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
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
});
