import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/index';

const RegisterScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigation.navigate('VerifyOtp', { phone: formData.phone });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.title}>Join Wari App</Title>
        <Text style={styles.subtitle}>Start sending money with ease today.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChangeText={(v) => updateField('firstName', v)}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChangeText={(v) => updateField('lastName', v)}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(v) => updateField('phone', v)}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Email (Optional)"
          value={formData.email}
          onChangeText={(v) => updateField('email', v)}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(v) => updateField('password', v)}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={styles.input}
        />

        <TextInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(v) => updateField('confirmPassword', v)}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={styles.input}
        />

        {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Create Account
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
