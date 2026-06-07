import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Portal, Dialog, Button, useTheme } from 'react-native-paper';
import * as Speech from 'expo-speech';

export const VoiceAssistant = ({ onCommand }: { onCommand: (cmd: string) => void }) => {
  const [visible, setVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const theme = useTheme();

  const toggleAssistant = () => {
    setVisible(!visible);
    if (!visible) {
      Speech.speak("Bonjour, comment puis-je vous aider ?", { language: 'fr' });
    }
  };

  const simulateVoiceCommand = (cmd: string) => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setVisible(false);
      onCommand(cmd);
      Speech.speak(`D'accord, je prépare le transfert de ${cmd.split(' ')[1]} francs.`, { language: 'fr' });
    }, 2000);
  };

  return (
    <>
      <FAB
        icon="microphone"
        style={[styles.fab, { backgroundColor: theme.colors.secondary }]}
        onPress={toggleAssistant}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Assistance IA Vocale</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.listeningText}>
              {isListening ? "Écoute en cours..." : "Dites quelque chose comme : 'Envoyer 5000 à Papa'"}
            </Text>
            {!isListening && (
              <View style={styles.suggestions}>
                <Button onPress={() => simulateVoiceCommand("Envoyer 5000")}>Test: 'Envoyer 5000'</Button>
              </View>
            )}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 80,
    bottom: 0,
  },
  listeningText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
  suggestions: {
    marginTop: 10,
  }
});
