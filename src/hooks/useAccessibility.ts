import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Hook for managing accessibility features
 */
export const useAccessibility = () => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1);

  /**
   * Announce message to screen readers
   */
  const announce = useCallback(async (message: string) => {
    try {
      await AccessibilityInfo.announceForAccessibility(message);
    } catch (error) {
      console.error('Failed to announce:', error);
    }
  }, []);

  /**
   * Check screen reader status
   */
  const checkScreenReader = useCallback(async () => {
    try {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setScreenReaderEnabled(isEnabled);
      return isEnabled;
    } catch (error) {
      console.error('Failed to check screen reader:', error);
      return false;
    }
  }, []);

  /**
   * Focus on element
   */
  const focusElement = useCallback((ref: any, message?: string) => {
    try {
      AccessibilityInfo.setAccessibilityFocus(ref);
      if (message) {
        announce(message);
      }
    } catch (error) {
      console.error('Failed to focus:', error);
    }
  }, [announce]);

  return {
    screenReaderEnabled,
    highContrastEnabled,
    setHighContrastEnabled,
    voiceCommandsEnabled,
    setVoiceCommandsEnabled,
    textSizeMultiplier,
    setTextSizeMultiplier,
    announce,
    checkScreenReader,
    focusElement,
  };
};
