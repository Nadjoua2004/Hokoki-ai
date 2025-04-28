import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/welcomeScreen.js';
import OnboardingScreen from './screens/OnboardingScreen.js';
import SignIn from './pages/SignIn.js';
import LogIn from './pages/LogIn.js';
import ForgotPass from './pages/ForgotPass.js';
import LawyerAcc from './pages/LawyerAcc.js';
import ChatPage from './pages/ChatPage.js';
import ResetPass from './pages/ResetPass.js';
import Welcom from './pages/Welcom.js';
import Notification from './pages/Notification.js';
import LawyerProfile from './pages/LawyerProfile.js';
import MainContainer from './navigation/MainContainer'; 
import ChatBot  from './navigation/screens/ChatBot.js'; 
import Documments from './navigation/screens/Documments.js'; 
import LawyerMain from './navigation/screens/LawyerMain.js'; 
import Profile from './navigation/screens/Profile.js'; 
import ProfileLawyer from './navigation/screens/ProfileLawyer.js'; 
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
        <Stack.Screen name="MainContainer" component={MainContainer} />
        <Stack.Screen name="Docummentsr" component={Documments} />
        <Stack.Screen name="ChatBot" component={ChatBot} />
        <Stack.Screen name="LawyerMain" component={LawyerMain} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProfileLawyer" component={ProfileLawyer} />
        <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen name="LawyerProfile" component={LawyerProfile} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="termsConditions" component={termsConditions} />
         
      </Stack.Navigator>
    </NavigationContainer>
  );
}
