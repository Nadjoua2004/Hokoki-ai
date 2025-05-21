import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet,
  RefreshControl,
  ScrollView 
} from 'react-native';
import { CaretRight, MagicWand, CaretLeft, Gear, SignOut, Bell } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: 'Loading...',
    phonenumb: 'Loading...',
    email: 'Loading...',
    photo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const DEFAULT_PHOTO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      const response = await fetch(`http://192.168.142.1:5000/api/user/${userId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user data');
      }
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch user data');
      }
      
      setUser({
        name: data.user.name || 'No Name Provided',
        surname: data.user.surname || '',
        phonenumb: data.user.phonenumb || 'No Phone Number',
        email: data.user.email || 'No Email Provided',
        photo: data.user.photo || DEFAULT_PHOTO,
        createdAt: data.user.createdAt || ''
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setUser({
        name: 'Mouhamed Tam',
        phonenumb: '0666534892',
        email: 'mouhamed10@gmail.com',
        photo: DEFAULT_PHOTO
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userToken');
      navigation.navigate("SignIn");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#003366']}
        />
      }
    >
      <View style={styles.iconTextContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={32} color="#003366" weight="bold" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.profileTitle}>Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user.photo }}
            style={styles.profileImage}
            onError={() => setUser(prev => ({...prev, photo: DEFAULT_PHOTO}))}
            defaultSource={{ uri: DEFAULT_PHOTO }}
          />
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileContact}>{user.phonenumb}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate("Notification")}
        >
          <Bell size={24} color="#003366" />
          <Text style={styles.menuText}>Notifications</Text>
          <CaretRight size={24} color="#003366" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
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

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
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
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 15,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#003366",
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  profileContact: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: "#003366",
  },
  errorBanner: {
    backgroundColor: '#ffeeee',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProfileScreen;