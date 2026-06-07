import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';

const TopUpScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleTopUp = async () => {
    setIsLoading(true);
    // In a real app, call TopUp API
    setTimeout(() => {
      setIsLoading(false);
      alert('Top-up initiated! Redirecting to payment...');
      navigation.navigate('Dashboard');
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Title style={styles.title}>Top Up Account</Title>

      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text style={styles.label}>Current Balance</Text>
          <Text style={styles.balanceValue}>{(user?.balance || 0).toLocaleString()} XOF</Text>
        </Card.Content>
      </Card>

      <View style={styles.form}>
        <TextInput
          label="Amount to Add (XOF)"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.info}>
          You can top up your Wari wallet using any mobile money provider.
        </Text>

        <Button
          mode="contained"
          onPress={handleTopUp}
          loading={isLoading}
          disabled={isLoading || !amount || Number(amount) < 100}
          style={styles.button}
        >
          Proceed to Payment
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balanceCard: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  info: {
    marginBottom: 20,
    fontSize: 12,
    opacity: 0.6,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

export default TopUpScreen;
