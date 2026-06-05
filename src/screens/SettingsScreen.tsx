import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Switch, useTheme } from 'react-native-paper';
import { AppSettings } from '@types/index';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => Promise<void>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const theme = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateSettings(localSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setLocalSettings({
      ...localSettings,
      [key]: value,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      accessible={true}
      accessibilityLabel="Settings screen"
      accessibilityRole="main"
    >
      <View style={styles.content}>
        {/* Security Settings */}
        <Card style={styles.card}>
          <Card.Title
            title="Security"
            accessibilityRole="header"
          />
          <Card.Content>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
              <Switch
                value={localSettings.biometricEnabled}
                onValueChange={(value) => updateSetting('biometricEnabled', value)}
                accessible={true}
                accessibilityLabel="Biometric authentication toggle"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto-Lock Timeout (minutes)</Text>
              <Text style={styles.settingValue}>
                {localSettings.autoLockTimeout / 60}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.card}>
          <Card.Title
            title="Notifications"
            accessibilityRole="header"
          />
          <Card.Content>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={localSettings.notificationsEnabled}
                onValueChange={(value) => updateSetting('notificationsEnabled', value)}
                accessible={true}
                accessibilityLabel="Push notifications toggle"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Offline Sync</Text>
              <Switch
                value={localSettings.offlineSyncEnabled}
                onValueChange={(value) => updateSetting('offlineSyncEnabled', value)}
                accessible={true}
                accessibilityLabel="Offline sync toggle"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Accessibility Settings */}
        <Card style={styles.card}>
          <Card.Title
            title="Accessibility"
            accessibilityRole="header"
          />
          <Card.Content>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Screen Reader</Text>
              <Switch
                value={localSettings.accessibility.screenReaderEnabled}
                onValueChange={(value) =>
                  updateSetting('accessibility', {
                    ...localSettings.accessibility,
                    screenReaderEnabled: value,
                  })
                }
                accessible={true}
                accessibilityLabel="Screen reader toggle"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>High Contrast</Text>
              <Switch
                value={localSettings.accessibility.highContrastEnabled}
                onValueChange={(value) =>
                  updateSetting('accessibility', {
                    ...localSettings.accessibility,
                    highContrastEnabled: value,
                  })
                }
                accessible={true}
                accessibilityLabel="High contrast toggle"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={localSettings.accessibility.darkModeEnabled}
                onValueChange={(value) =>
                  updateSetting('accessibility', {
                    ...localSettings.accessibility,
                    darkModeEnabled: value,
                  })
                }
                accessible={true}
                accessibilityLabel="Dark mode toggle"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
          accessible={true}
          accessibilityLabel="Save settings"
        >
          Save Settings
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
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 14,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
});
