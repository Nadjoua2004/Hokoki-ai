import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Gavel , Robot, FileText, User } from 'phosphor-react-native';

// screens 
import Documments from './screens/Documments';
import ChatBot from './screens/ChatBot';
import LawyerMain from './screens/LawyerMain';
import Profile from './screens/Profile';

const DocummentsName = 'Doc';
const ChatBotName = 'ChatBot';
const LawyerMainName = 'Lawyers';
const ProfileName = 'Profile';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={ChatBotName} 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let rn = route.name;

          if (rn === ChatBotName) {
            return <Robot size={size}  color={focused ? "#003366" : '#6C757D'} weight={focused ? "fill" : "regular"} />;
          } else if (rn === DocummentsName) {
            return <FileText size={size} color={color} weight={focused ? "fill" : "regular"} />;
          } else if (rn === LawyerMainName) {
            return <Gavel size={size} color={color} weight={focused ? "fill" : "regular"} />;
          } else if (rn === ProfileName) {
            return <User size={size} color={color} weight={focused ? "fill" : "regular"} />;
          }
        },
        tabBarActiveTintColor: "#003366", 
        tabBarInactiveTintColor: '#6C757D',
        headerShown: false, 
      })}
    >
      <Tab.Screen name={ChatBotName} component={ChatBot} />
      <Tab.Screen name={DocummentsName} component={Documments} />
      <Tab.Screen name={LawyerMainName} component={LawyerMain} />
      <Tab.Screen name={ProfileName} component={Profile} />
    </Tab.Navigator>
  );
}
