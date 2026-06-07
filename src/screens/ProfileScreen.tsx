import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, AccessibilityInfo } from 'react-native';
import { Card, Text, Button, useTheme, Dialog, Portal } from 'react-native-paper';
import { User } from '../types/index';

interface ProfileScreenProps {
  user: User | null;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
}

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/index';
import { logoutAction, updateUser } from '../store/slices/authSlice';

export const ProfileScreen: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  const onLogout = () => dispatch(logoutAction());
  const onUpdateProfile = async (updates: Partial<User>) => {
    dispatch(updateUser(updates));
  };
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      onLogout();
      await AccessibilityInfo.announceForAccessibility('Logged out successfully');
    } finally {
      setIsLoading(false);
      setShowLogoutDialog(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}

      accessibilityLabel="Profile screen"

    >
      <View style={styles.content}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text
              style={[styles.name, { color: theme.colors.primary }]}

            >
              {user.firstName} {user.lastName}
            </Text>
            <Text style={[styles.phone, { color: theme.colors.onSurfaceVariant }]}>
              {user.phone}
            </Text>
            <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
              {user.email}
            </Text>
          </Card.Content>
        </Card>

        {/* Account Status */}
        <Card style={styles.card}>
          <Card.Title
            title="Account Status"

          />
          <Card.Content>
            <View style={styles.statusRow}>
              <Text style={styles.label}>KYC Status:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      user.kycStatus === 'verified'
                        ? theme.colors.primary
                        : theme.colors.error,
                  },
                ]}
              >
                {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Account:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      (user.accountStatus || 'active') === 'active'
                        ? theme.colors.primary
                        : theme.colors.error,
                  },
                ]}
              >
                {(user.accountStatus || 'active').charAt(0).toUpperCase() + (user.accountStatus || 'active').slice(1)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Security Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Referral Program</Text>
            <View style={styles.referralBox}>
              <Text>Your Code:</Text>
              <Text style={styles.referralCode}>{user.referralCode || 'N/A'}</Text>
            </View>
            <Text style={styles.infoText}>Share this code and earn 500 XOF for every friend who completes a transfer.</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title
            title="Security"

          />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={() => {
                // Navigate to security settings
                AccessibilityInfo.announceForAccessibility(
                  'Opening security settings'
                );
              }}
              style={styles.button}

              accessibilityLabel="Security settings"
              accessibilityHint="Manage biometric, PIN, and password settings"
            >
              Manage Security
            </Button>
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Title
            title="Settings"

          />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={() => {
                AccessibilityInfo.announceForAccessibility('Opening app settings');
              }}
              style={styles.button}

              accessibilityLabel="App settings"
              accessibilityHint="Configure notifications, accessibility, and preferences"
            >
              App Settings
            </Button>
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={() => setShowLogoutDialog(true)}
          loading={isLoading}
          disabled={isLoading}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}

          accessibilityLabel="Logout button"
          accessibilityHint="Double tap to logout from your account"
        >
          Logout
        </Button>
      </View>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}


        >
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to logout from your account?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowLogoutDialog(false)}

              accessibilityLabel="Cancel"
            >
              Cancel
            </Button>
            <Button
              onPress={handleLogout}

              accessibilityLabel="Confirm logout"
            >
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  card: {
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 8,
  },
  logoutButton: {
    marginVertical: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  referralBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  referralCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7900',
  },
  infoText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
