import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, HelperText } from 'react-native-paper';
import BiometricAuthService from '../services/auth/biometricAuth';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/index';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();

  useEffect(() => {
    BiometricAuthService.isAvailable().then(setBiometricAvailable);
  }, []);

  const handleLogin = () => {
    dispatch(login({ phone, password }));
  };

  const handleBiometricLogin = async () => {
    const result = await BiometricAuthService.authenticate();
    if (result.success) {
      // In a real app, you'd send a biometric token to the backend
      // For this demo, we'll assume the user is already remembered
      const storedPhone = await phone; // simplified
      if (storedPhone) {
        // dispatch(biometricLogin({ phone: storedPhone }));
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.title}>Wari App</Title>
        <Text style={styles.subtitle}>Welcome back! Please login to your account.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
          style={styles.input}
        />

        {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading || !phone || !password}
          style={styles.button}
        >
          Login
        </Button>

        {biometricAvailable && (
          <Button
            mode="outlined"
            onPress={handleBiometricLogin}
            icon="fingerprint"
            style={styles.biometricButton}
          >
            Login with Biometric
          </Button>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  biometricButton: {
    marginTop: 10,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
