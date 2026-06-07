import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons, Chip } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const transferFormSchema = z.object({
  recipientPhone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Invalid phone number'),
  amount: z
    .number()
    .min(100, 'Minimum amount is 100 XOF')
    .max(5000000, 'Maximum amount is 5,000,000 XOF'),
  provider: z.enum(['orange-money', 'mtn-money', 'moov-money', 'wave']),
});

type TransferFormData = z.infer<typeof transferFormSchema>;

interface TransferFormProps {
  onSubmit: (data: TransferFormData) => Promise<void>;
  isLoading?: boolean;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [estimatedFee, setEstimatedFee] = useState(0);

  const { control, handleSubmit, watch } = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      recipientPhone: '',
      amount: 0,
      provider: 'wave',
    },
  });

  const amount = watch('amount');
  const provider = watch('provider');

  React.useEffect(() => {
    // Calculate estimated fee based on provider and amount
    if (amount > 0) {
      const feePercentage = {
        'wave': 0.012,
        'orange-money': 0.015,
        'moov-money': 0.017,
        'mtn-money': 0.018,
      }[provider] || 0.012;

      setEstimatedFee(Math.ceil(amount * feePercentage));
    }
  }, [amount, provider]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}

      accessibilityLabel="Money Transfer Form"

    >
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: theme.colors.primary }]}

        >
          Send Money
        </Text>

        <Controller
          control={control}
          name="provider"
          render={({ field: { value, onChange } }) => (
            <View style={styles.section}>
              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}

              >
                Select Provider
              </Text>
              <SegmentedButtons
                value={value}
                onValueChange={onChange}
                buttons={[
                  {
                    value: 'wave',
                    label: 'Wave',
                    accessibilityLabel: 'Wave - 1.2% fee',
                  },
                  {
                    value: 'orange-money',
                    label: 'Orange',
                    accessibilityLabel: 'Orange Money - 1.5% fee',
                  },
                  {
                    value: 'moov-money',
                    label: 'Moov',
                    accessibilityLabel: 'Moov Money - 1.7% fee',
                  },
                  {
                    value: 'mtn-money',
                    label: 'MTN',
                    accessibilityLabel: 'MTN Money - 1.8% fee',
                  },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="recipientPhone"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={styles.section}>
              <TextInput
                label="Recipient Phone Number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                placeholder="07XXXXXXXX"
                mode="outlined"
                style={styles.input}

                accessibilityLabel="Recipient phone number"
                accessibilityHint="Enter 10-digit phone number"
                error={!!error}
              />
              {error && (
                <Text
                  style={[styles.errorText, { color: theme.colors.error }]}

                  accessibilityLiveRegion="polite"

                >
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={styles.section}>
              <TextInput
                label="Amount (XOF)"
                value={value.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="decimal-pad"
                mode="outlined"
                style={styles.input}

                accessibilityLabel="Transfer amount"
                accessibilityHint="Enter amount in West African Franc"
                error={!!error}
              />
              {error && (
                <Text
                  style={[styles.errorText, { color: theme.colors.error }]}

                  accessibilityLiveRegion="polite"

                >
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />

        {estimatedFee > 0 && (
          <View style={styles.feeBreakdown}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Amount:</Text>
              <Text style={styles.feeValue}>
                {amount.toLocaleString()} XOF
              </Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Fee:</Text>
              <Chip
                style={styles.feeChip}
              >
                {`${estimatedFee.toLocaleString()} XOF (${((estimatedFee / amount) * 100).toFixed(2)}%)`}
              </Chip>
            </View>
            <View style={[styles.feeRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {(amount + estimatedFee).toLocaleString()} XOF
              </Text>
            </View>
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          style={styles.submitButton}

          accessibilityLabel="Submit transfer"
          accessibilityHint="Tap to review and confirm your transfer"
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
  },
  segmentedButtons: {
    minHeight: 48,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  feeBreakdown: {
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  feeLabel: {
    fontSize: 14,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feeChip: {
    height: 28,
  },
  submitButton: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
});
