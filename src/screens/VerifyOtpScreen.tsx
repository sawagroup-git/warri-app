import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/index';

const VerifyOtpScreen = ({ route }: any) => {
  const { phone } = route.params;
  const [code, setCode] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();

  const handleVerify = () => {
    dispatch(verifyOtp({ phone, code }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.title}>Verify Phone</Title>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {phone}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          mode="outlined"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
        />

        {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}

        <Button
          mode="contained"
          onPress={handleVerify}
          loading={isLoading}
          disabled={isLoading || code.length < 6}
          style={styles.button}
        >
          Verify & Continue
        </Button>
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
    fontSize: 24,
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
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

export default VerifyOtpScreen;
