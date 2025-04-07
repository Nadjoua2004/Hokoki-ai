import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import welcomeScreen from './screens/welcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen.js';
import SignIn  from './pages/SignIn.js';
import LogIn from './pages/LogIn.js';
import ForgotPass from './pages/ForgotPass.js';
import LawyerAcc from './pages/LawyerAcc.js';
import ResetPass from './pages/ResetPass.js';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={welcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="LawyerAcc" component={LawyerAcc} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
