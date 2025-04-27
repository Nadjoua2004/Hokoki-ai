import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { CaretRight,CaretLeft ,Gear, SignOut, Bell} from 'phosphor-react-native';

const ProfileScreen = () => {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem('userId');
  //       const response = await fetch(`http://192.168.43.76:5000/api/user/${userId}`);
  //       const data = await response.json();
  //       setUser(data);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#003366" />;
  // }

  // if (!user) {
  //   return <Text>No user data available</Text>;
  // }
  return (
    
    <View style={styles.container}>
        <View style={styles.iconTextContainer}>
        <CaretLeft size={32} color="#003366" weight="bold" marginTop='28'/> {/* Change color here */}
        <Text style={styles.profileTitle}>Profile</Text>
      </View>
      <View style={styles.profileHeader}>
       
        <View style={styles.profileImageContainer}>
          
          <Image
            source={ require('../../assets/userprofile.png') }
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>Robi</Text>
        <Text style={styles.profileContact}>8967452743</Text>
        <Text style={styles.profileEmail}>robi123@gmail.com</Text>
      </View>

      <View style={styles.menuContainer}>
       
        <TouchableOpacity style={styles.menuItem}>
          <Bell size={24} color="#003366" />
          <Text style={styles.menuText}>Notifications</Text>
          <CaretRight size={24} color="#003366" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="privacy-tip" size={24} color="#003366" />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <CaretRight size={24} color="#003366" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Gear size={24} color="#003366" />
          <Text style={styles.menuText}>Settings</Text>
          <CaretRight size={24} color="#003366" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <SignOut size={24} color="#003366" />
          <Text style={styles.menuText}>Log out</Text>
          <CaretRight size={24} color="#003366" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  
    color: "#003366",
    marginTop: 28
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 28
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    color: "#003366",
    
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContact: {
    fontSize: 16,
    color: '#555',
  },
  profileEmail: {
    fontSize: 16,
    color: '#555',
  },
  menuContainer: {
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
    color: "#003366",
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen;
