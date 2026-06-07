import React, { useState, useEffect } from 'react';
import { View, StyleSheet, AccessibilityInfo, useWindowDimensions } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';

interface BiometricLoginProps {
  onSuccess: (userId: string) => void;
  onError: (error: string) => void;
  isBiometricAvailable: boolean;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({
  onSuccess,
  onError,
  isBiometricAvailable,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPinFallback, setShowPinFallback] = useState(false);
  const [pin, setPin] = useState('');
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const accessibilityLabel = 'Biometric Authentication Screen';
  const accessibilityHint = 'Use your fingerprint or face to authenticate';

  useEffect(() => {
    // Announce screen to screen readers
    AccessibilityInfo.announceForAccessibility(
      'Welcome to Wari. Use your fingerprint or face to sign in.'
    );
  }, []);

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      // Biometric authentication logic
      // Placeholder for actual implementation
      setTimeout(() => {
        onSuccess('user-123');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      onError((error as Error).message);
      setIsLoading(false);
      setShowPinFallback(true);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      onError('PIN must be 4 digits');
      return;
    }
    setIsLoading(true);
    try {
      // PIN authentication logic
      setTimeout(() => {
        onSuccess('user-123');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      onError((error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}

      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}

    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.primary },
          ]}

        >
          Wari
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
          Secure Login
        </Text>
      </View>

      {!showPinFallback && isBiometricAvailable && (
        <View style={styles.biometricSection}>
          <Button
            mode="contained"
            onPress={handleBiometricAuth}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}

            accessibilityLabel="Biometric authentication button"
            accessibilityHint="Double tap to authenticate with your fingerprint or face"

          >
            {isLoading ? 'Authenticating...' : 'Use Biometric'}
          </Button>
          <Button
            mode="text"
            onPress={() => setShowPinFallback(true)}
            style={styles.fallbackButton}

            accessibilityLabel="Use PIN instead"
          >
            Use PIN Instead
          </Button>
        </View>
      )}

      {showPinFallback && (
        <View style={styles.pinSection}>
          <TextInput
            label="Enter 4-Digit PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry={true}
            keyboardType="numeric"
            maxLength={4}
            mode="outlined"
            style={styles.input}

            accessibilityLabel="PIN input field"
            accessibilityHint="Enter your 4-digit PIN to authenticate"
          />
          <Button
            mode="contained"
            onPress={handlePinSubmit}
            loading={isLoading}
            disabled={isLoading || pin.length !== 4}
            style={styles.button}

            accessibilityLabel="Submit PIN button"

          >
            Submit
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  biometricSection: {
    gap: 12,
  },
  pinSection: {
    gap: 16,
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
  },
  fallbackButton: {
    marginTop: 8,
  },
  input: {
    fontSize: 24,
    letterSpacing: 4,
  },
});
