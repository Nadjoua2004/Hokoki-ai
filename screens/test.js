import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import welcomeScreen from './screens/welcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen.js';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={welcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
