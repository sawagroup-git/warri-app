import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import { Card, Text, useTheme, Chip, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { cancelTransactionAction } from '../../store/slices/transactionSlice';
import { AppDispatch } from '../../store/index';
import { Transaction } from '../../types/index';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onSelectTransaction?: (transaction: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  isLoading = false,
  onSelectTransaction,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const canCancel = (item: Transaction) => {
    if (item.status !== 'pending' && item.status !== 'processing') return false;
    const createdAt = new Date(item.createdAt).getTime();
    const now = Date.now();
    return now - createdAt < 5 * 60 * 1000;
  };
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (
    status: Transaction['status']
  ): string => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      case 'cancelled':
        return '#757575';
      default:
        return theme.colors.primary;
    }
  };

  const handleSelectTransaction = (
    transaction: Transaction
  ) => {
    setSelectedId(transaction.id);
    onSelectTransaction?.(transaction);

    // Announce selection to screen readers
    AccessibilityInfo.announceForAccessibility(
      `Transaction ${transaction.reference}: ${formatCurrency(transaction.amount)} to ${transaction.recipientPhone}`
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => handleSelectTransaction(item)}

      accessibilityLabel={`Transaction ${item.reference}`}
      accessibilityHint={`${formatCurrency(item.amount)} sent to ${item.recipientPhone} via ${item.provider}`}

    >
      <Card
        style={[
          styles.card,
          selectedId === item.id && {
            backgroundColor: theme.colors.surfaceVariant,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.transactionHeader}>
            <Text
              style={[styles.reference, { color: theme.colors.onBackground }]}

            >
              Ref: {item.reference}
            </Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={{ color: '#fff' }}

              accessibilityLabel={`Status: ${item.status}`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Chip>
          </View>

          <View style={styles.transactionDetails}>
            <View>
              <Text style={styles.amount} >
                {formatCurrency(item.amount)}
              </Text>
              <Text
                style={[styles.recipient, { color: theme.colors.onSurfaceVariant }]}

              >
                To: {item.recipientPhone}
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <Text
                style={[styles.provider, { color: theme.colors.onSurfaceVariant }]}

              >
                {item.provider}
              </Text>
              <Text
                style={[styles.date, { color: theme.colors.onSurfaceVariant }]}

              >
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {item.fee > 0 && (
            <Text
              style={[styles.fee, { color: theme.colors.error }]}

            >
              Fee: {formatCurrency(item.fee)} ({((item.fee / item.amount) * 100).toFixed(2)}%)
            </Text>
          )}

          {canCancel(item) && (
            <Button
              mode="outlined"
              onPress={() => dispatch(cancelTransactionAction(item.id))}
              style={styles.cancelButton}
              textColor={theme.colors.error}
            >
              Cancel (5m)
            </Button>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}

      accessibilityLabel="Transaction History"

    >
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[styles.emptyText, { color: theme.colors.onBackground }]}

          >
            No transactions yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          scrollEventThrottle={16}

          accessibilityLabel="Transactions list"

        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reference: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusChip: {
    borderRadius: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipient: {
    fontSize: 13,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  provider: {
    fontSize: 12,
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
  },
  fee: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
});
