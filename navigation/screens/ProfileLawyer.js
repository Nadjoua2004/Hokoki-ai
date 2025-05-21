import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CaretRight, MagicWand, CaretLeft, Gear, SignOut, Bell } from 'phosphor-react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileLawyer = () => {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchLawyerData = async () => {
    try {
      // 1. Get stored credentials
      const lawyerId = await AsyncStorage.getItem('lawyerId');
      const token = await AsyncStorage.getItem('token');
      
      console.log('LawyerID from storage:', lawyerId);
      if (!lawyerId) throw new Error('No lawyer ID found');

      // 2. Make API call
      const API_URL = `http://192.168.142.1:5000/api/lawyer/${lawyerId}`;
      console.log('Fetching from:', API_URL);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(API_URL, { headers });
      const responseText = await response.text();
      
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed data:', data);

      if (!data.success || !data.lawyer) {
        throw new Error('Invalid data format from server');
      }

      setLawyer(data.lawyer);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      Alert.alert('Error', `Failed to load profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyerData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchLawyerData();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['lawyerId', 'token']);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading profile</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={32} color="#003366" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </View>
  
      {lawyer ? (
        <>
          <View style={styles.profileSection}>
            <Image
              source={lawyer.photo ? { uri: lawyer.photo } : require('../../assets/userprofile.png')}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{'Nadjoua Sahnoune'}</Text>
            <Text style={styles.detail}>{lawyer.email || 'nadjouasahnoune@gmail.com'}</Text>
            <Text style={styles.detail}>{lawyer.phonenumb || '0546372819'}</Text>
            {lawyer.idc && <Text style={styles.detail}>Bar ID: {lawyer.idc}</Text>}
          </View>
  
          <View style={styles.menu}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate("Notification")}
            >
              <Bell size={24} color="#003366" />
              <Text style={styles.menuText}>Notifications</Text>
              <CaretRight size={24} color="#003366" />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("UpdateLawyerInfo")}>
              <MagicWand size={24} color="#003366" />
              <Text style={styles.menuText}>Level Up Your Profile</Text>
              <CaretRight size={24} color="#003366" />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.menuItem}>
              <Gear size={24} color="#003366" />
              <Text style={styles.menuText}>Settings</Text>
              <CaretRight size={24} color="#003366" />
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLogout}
            >
              <SignOut size={24} color="#003366" />
              <Text style={styles.menuText}>Log out</Text>
              <CaretRight size={24} color="#003366" />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#003366',
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#003366',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileLawyer;