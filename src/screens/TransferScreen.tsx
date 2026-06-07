import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, Card, RadioButton, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { sendMoneyAction } from '../store/slices/transactionSlice';
import { AppDispatch, RootState } from '../store/index';
import { MobileMoneyProvider } from '../types';

const providers: { id: MobileMoneyProvider; name: string; color: string }[] = [
  { id: 'orange_money', name: 'Orange Money', color: '#FF7900' },
  { id: 'mtn_money', name: 'MTN Money', color: '#FFCC00' },
  { id: 'moov_money', name: 'Moov Money', color: '#005CA9' },
  { id: 'wave', name: 'Wave', color: '#00A1E4' },
];

const TransferScreen = ({ navigation, route }: any) => {
  const initialAmount = route.params?.initialAmount || '';
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState(initialAmount);
  const [provider, setProvider] = useState<MobileMoneyProvider>('orange_money');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.transactions);
  const theme = useTheme();

  const handleTransfer = async () => {
    const resultAction = await dispatch(sendMoneyAction({
      recipientPhone,
      amount: Number(amount),
      provider,
      description,
    }));

    if (sendMoneyAction.fulfilled.match(resultAction)) {
      navigation.navigate('Dashboard');
    }
  };

  const calculateFee = (val: string) => {
    const amt = Number(val);
    if (isNaN(amt)) return 0;
    const rates: Record<string, number> = {
      orange_money: 0.015,
      mtn_money: 0.018,
      moov_money: 0.017,
      wave: 0.012,
    };
    return Math.ceil(amt * (rates[provider] || 0.02));
  };

  const total = Number(amount) + calculateFee(amount);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Title style={styles.title}>Send Money</Title>

      <View style={styles.section}>
        <Text style={styles.label}>Select Provider</Text>
        <View style={styles.providerGrid}>
          {providers.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.providerCard,
                { borderColor: provider === p.id ? p.color : '#ddd', borderWidth: provider === p.id ? 2 : 1 }
              ]}
              onPress={() => setProvider(p.id)}
            >
              <Text style={{ color: provider === p.id ? p.color : '#333', fontWeight: 'bold' }}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Recipient Phone Number"
          value={recipientPhone}
          onChangeText={setRecipientPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Amount (XOF)"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
        />

        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text>Amount:</Text>
              <Text>{amount || '0'} XOF</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Fee:</Text>
              <Text>{calculateFee(amount)} XOF</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalText}>{isNaN(total) ? '0' : total} XOF</Text>
            </View>
          </Card.Content>
        </Card>

        {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}

        <Button
          mode="contained"
          onPress={handleTransfer}
          loading={isLoading}
          disabled={isLoading || !recipientPhone || !amount}
          style={styles.button}
        >
          Confirm Transfer
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  providerCard: {
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  summaryCard: {
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
});

export default TransferScreen;
