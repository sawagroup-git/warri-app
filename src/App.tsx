import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './store/index';
import { useSelector } from 'react-redux';
import { RootState } from './store/index';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TransferScreen from './screens/TransferScreen';
import VerifyOtpScreen from './screens/VerifyOtpScreen';
import TopUpScreen from './screens/TopUpScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Transfer" component={TransferScreen} />
            <Stack.Screen name="TopUp" component={TopUpScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </ReduxProvider>
  );
}
