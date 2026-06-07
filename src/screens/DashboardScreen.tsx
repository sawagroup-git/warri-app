import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator, FAB } from 'react-native-paper';
import { Transaction } from '../types/index';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchAnalyticsAction } from '../store/slices/transactionSlice';
import { AppDispatch, RootState } from '../store/index';
import { VoiceAssistant } from '../components/VoiceAssistant';

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, isLoading, stats } = useSelector((state: RootState) => state.transactions);
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTransactions({}));
      await dispatch(fetchAnalyticsAction());
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate statistics
  const totalSent = stats?.totalSent || transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.fee, 0);

  const recentCount = stats?.totalTransactions || transactions.filter((t) => {
    const txnDate = new Date(t.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return txnDate > thirtyDaysAgo;
  }).length;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      accessibilityLabel="Dashboard"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Statistics Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.primary }]}
          >
            Your Activity
          </Text>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Card.Content>
                <Text style={styles.statLabel}>Total Sent</Text>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                  accessibilityLabel={`Total sent: ${formatCurrency(totalSent)}`}
                >
                  {formatCurrency(totalSent)}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content>
                <Text style={styles.statLabel}>Fees Paid</Text>
                <Text
                  style={[styles.statValue, { color: theme.colors.error }]}
                  accessibilityLabel={`Fees paid: ${formatCurrency(totalFees)}`}
                >
                  {formatCurrency(totalFees)}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content>
                <Text style={styles.statLabel}>Recent</Text>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                  accessibilityLabel={`${recentCount} transactions in last 30 days`}
                >
                  {recentCount}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.primary }]}
          >
            Recent Transactions
          </Text>

          {isLoading && !transactions.length ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <TransactionHistory
              transactions={transactions.slice(0, 5)}
              isLoading={isLoading}
              onSelectTransaction={() => {}}
            />
          )}
        </View>
      </ScrollView>

      <VoiceAssistant onCommand={(cmd) => {
        if (cmd.startsWith("Envoyer")) {
          const amount = cmd.split(' ')[1];
          navigation.navigate('Transfer', { initialAmount: amount });
        }
      }} />

      {/* FAB - Send Money */}
      <FAB
        icon="send"
        onPress={() => navigation.navigate('Transfer')}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        accessibilityLabel="Send money"
        accessibilityHint="Double tap to send money"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
