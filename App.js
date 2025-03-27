<<<<<<< HEAD
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BeginScreen from "./pages/BeginScreen";
import FirstPage from "./pages/firstPage"; // تأكد أن الاسم يتطابق مع اسم الملف تمامًا;
import SecondPage from "./pages/secondPage";
import SignIn from "./pages/SignIn";
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import welcomeScreen from './screens/welcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen.js';

>>>>>>> fb002b5 (OnboardingScreenDone)

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
        
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="SecondPage" component={SecondPage} />
        <Stack.Screen name="BeginScreen" component={BeginScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
=======
        <Stack.Screen name="Welcome" component={welcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
       
>>>>>>> fb002b5 (OnboardingScreenDone)
      </Stack.Navigator>
    </NavigationContainer>
  );
}
