import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Gavel, Robot, FileText, User } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// screens
import Documments from './screens/Documments';
import ChatBot from './screens/ChatBot';
import LawyerMain from './screens/LawyerMain';
import Profile from './screens/Profile';
import ProfileLawyer from './screens/ProfileLawyer';

const DocumentsName = 'Doc';
const ChatBotName = 'ChatBot';
const LawyerMainName = 'Lawyers';
const ProfileName = 'Profile';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const type = await AsyncStorage.getItem('userType');
        if (!type) {
          console.warn('No userType found in storage');
        }
        setUserType(type);
      } catch (error) {
        console.error('Error checking user type:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName={ChatBotName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let rn = route.name;

          if (rn === ChatBotName) {
            return <Robot size={size} color={focused ? "#003366" : '#6C757D'} weight={focused ? "fill" : "regular"} />;
          } else if (rn === DocumentsName) {
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
      <Tab.Screen name={DocumentsName} component={Documments} />
      <Tab.Screen name={LawyerMainName} component={LawyerMain} />
      <Tab.Screen
        name={ProfileName}
        component={userType === 'lawyer' ? ProfileLawyer : Profile}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent navigation if userType isn't loaded yet
            if (userType === null) {
              e.preventDefault();
              console.warn('User type not determined yet');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}
