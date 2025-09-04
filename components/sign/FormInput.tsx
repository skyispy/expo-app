import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const FormInput = ({
  label, value, onChangeText, error, secureTextEntry = false
}: FormInputProps) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={text => onChangeText(text)}
        secureTextEntry={secureTextEntry}
      />
    </View>
    <View style={styles.errorContainer}>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  </>
);

interface FormInputWithButtonProps extends FormInputProps {
  buttonLabel: string;
  onButtonPress: () => void;
  disabled: boolean;
}

export const FormInputWithButton = ({
  label, value, onChangeText, error, buttonLabel, onButtonPress, disabled = false
}: FormInputWithButtonProps) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        value={value}
        onChangeText={text => onChangeText(text)}
        editable={!disabled}
      />
      <TouchableOpacity
        style={disabled ? [styles.button, { backgroundColor: 'gray' }] : styles.button}
        onPress={onButtonPress}
        disabled={disabled}
      >
        <Text style={disabled ? [styles.buttonText, { color: '#fff'}] : styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.errorContainer}>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  </>
)

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    marginTop: 8,
  },
  errorContainer: {
    minHeight: 30,
  },
  errorText: {
    color: 'red',
    marginTop: 2,
    fontSize: 12
  },
  button: {
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
  }
})