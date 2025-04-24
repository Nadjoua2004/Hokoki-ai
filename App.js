import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/welcomeScreen.js';
import OnboardingScreen from './screens/OnboardingScreen.js';
import SignIn  from './pages/SignIn.js';
import LogIn from './pages/LogIn.js'; 
import ForgotPass from './pages/ForgotPass.js';
import LawyerAcc from './pages/LawyerAcc.js';
import ResetPass from './pages/ResetPass.js';
import Welcom from './pages/Welcom.js';
import ChatPage from './pages/ChatPage.js';
import termsConditions from './pages/termsConditions.js';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="LawyerAcc" component={LawyerAcc} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
        <Stack.Screen name="Welcom" component={Welcom} />
        <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen name="termsConditions" component={termsConditions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
