// // import React, { useEffect, useState } from 'react';
// // import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
// // import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// // import { CaretRight, MagicWand, CaretLeft, Gear, SignOut, Bell } from 'phosphor-react-native';
// // import { useNavigation } from "@react-navigation/native";
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const ProfileLawyer = () => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const navigation = useNavigation();

// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         const lawyerId = await AsyncStorage.getItem('lawyerId');
// //         const response = await fetch(`http://192.168.43.76:5000/api/lawyers/${lawyerId}`);

// //         // Log the full response text for debugging
// //         const responseText = await response.text();
// //         console.log('Response Text:', responseText);

// //         if (!response.ok) {
// //           throw new Error(`Error fetching user data: ${response.statusText}`);
// //         }

// //         const data = JSON.parse(responseText);
// //         setUser(data.lawyer); // Ensure you are accessing the correct property
// //       } catch (error) {
// //         console.error('Error fetching user data:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUserData();
// //   }, []);

// //   if (loading) {
// //     return <ActivityIndicator size="large" color="#003366" />;
// //   }

// //   if (!user) {
// //     return <Text>No user data available</Text>;
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.iconTextContainer}>
// //         <TouchableOpacity onPress={() => navigation.navigate("ChatBot")}>
// //           <CaretLeft size={32} color="#003366" weight="bold" marginTop='28' />
// //         </TouchableOpacity>
// //         <Text style={styles.profileTitle}>Profile</Text>
// //       </View>
// //       <View style={styles.profileHeader}>
// //         <View style={styles.profileImageContainer}>
// //           <Image
// //             source={require('../../assets/userprofile.png')}
// //             style={styles.profileImage}
// //           />
// //         </View>
// //         <Text style={styles.profileName}>{user.name} {user.surname}</Text>
// //         <Text style={styles.profileContact}>{user.phonenumb}</Text>
// //         <Text style={styles.profileEmail}>{user.email}</Text>
// //       </View>

// //       <View style={styles.menuContainer}>
// //         <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Notification")}>
// //           <Bell size={24} color="#003366" />
// //           <Text style={styles.menuText}>Notifications</Text>
// //           <CaretRight size={24} color="#003366" />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.menuItem}>
// //           <MagicWand size={24} color="#003366" />
// //           <Text style={styles.menuText}>Level Up Your Profile</Text>
// //           <CaretRight size={24} color="#003366" />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.menuItem}>
// //           <Gear size={24} color="#003366" />
// //           <Text style={styles.menuText}>Settings</Text>
// //           <CaretRight size={24} color="#003366" />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("SignIn")}>
// //           <SignOut size={24} color="#003366" />
// //           <Text style={styles.menuText}>Log out</Text>
// //           <CaretRight size={24} color="#003366" />
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     padding: 20,
// //   },
// //   profileHeader: {
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   profileTitle: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: "#003366",
// //     marginTop: 28
// //   },
// //   profileImageContainer: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: '#f0f0f0',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //     marginTop: 28
// //   },
// //   profileImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 50,
// //   },
// //   profileName: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   profileContact: {
// //     fontSize: 16,
// //     color: '#555',
// //   },
// //   profileEmail: {
// //     fontSize: 16,
// //     color: '#555',
// //   },
// //   menuContainer: {
// //     marginTop: 20,
// //   },
// //   menuItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingVertical: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ddd',
// //   },
// //   menuText: {
// //     flex: 1,
// //     fontSize: 16,
// //     marginLeft: 15,
// //     color: "#003366",
// //   },
// //   iconTextContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// // });

// // export default ProfileLawyer;
// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
// import { CaretRight, MagicWand, Gear, SignOut, Bell } from 'phosphor-react-native';
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ProfileLawyer = () => {
//   const [lawyer, setLawyer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const lawyerId = await AsyncStorage.getItem('lawyerId');
//         if (!lawyerId) {
//           throw new Error('Lawyer ID not found');
//         }
//         const response = await fetch(`http://192.168.43.76:5000/api/lawyer/${lawyerId}`);
  
//         // Log the full response text for debugging
//         const responseText = await response.text();
//         console.log('Response Text:', responseText);
  
//         if (!response.ok) {
//           throw new Error(`Error fetching user data: ${response.statusText}`);
//         }
  
//         const data = JSON.parse(responseText);
//         console.log('Parsed Data:', data); // Log the parsed data
  
//         if (data.success && data.lawyer) {
//           setUser(data.lawyer); // Ensure you are accessing the correct property
//         } else {
//           throw new Error('Unexpected response format');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchUserData();
//   }, []);
  
//   if (loading) {
//     return <ActivityIndicator size="large" color="#003366" />;
//   }

//   if (!user) {
//     return <Text>No user data available</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.iconTextContainer}>
//         <TouchableOpacity onPress={() => navigation.navigate("ChatBot")}>
//           <CaretRight size={32} color="#003366" weight="bold" marginTop='28' />
//         </TouchableOpacity>
//         <Text style={styles.profileTitle}>Profile</Text>
//       </View>
//       <View style={styles.profileHeader}>
//         <View style={styles.profileImageContainer}>
//           <Image
//             source={require('../../assets/userprofile.png')}
//             style={styles.profileImage}
//           />
//         </View>
//         <Text style={styles.profileName}>{lawyer.name} {lawyer.surname}</Text>
//         <Text style={styles.profileContact}>{lawyer.phonenumb}</Text>
//         <Text style={styles.profileEmail}>{lawyer.email}</Text>
//       </View>

//       <View style={styles.menuContainer}>
//         <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Notification")}>
//           <Bell size={24} color="#003366" />
//           <Text style={styles.menuText}>Notifications</Text>
//           <CaretRight size={24} color="#003366" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <MagicWand size={24} color="#003366" />
//           <Text style={styles.menuText}>Level Up Your Profile</Text>
//           <CaretRight size={24} color="#003366" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem}>
//           <Gear size={24} color="#003366" />
//           <Text style={styles.menuText}>Settings</Text>
//           <CaretRight size={24} color="#003366" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("SignIn")}>
//           <SignOut size={24} color="#003366" />
//           <Text style={styles.menuText}>Log out</Text>
//           <CaretRight size={24} color="#003366" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: "#003366",
//     marginTop: 28
//   },
//   profileImageContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     marginTop: 28
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 50,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   profileContact: {
//     fontSize: 16,
//     color: '#555',
//   },
//   profileEmail: {
//     fontSize: 16,
//     color: '#555',
//   },
//   menuContainer: {
//     marginTop: 20,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   menuText: {
//     flex: 1,
//     fontSize: 16,
//     marginLeft: 15,
//     color: "#003366",
//   },
//   iconTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default ProfileLawyer;
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CaretRight,MagicWand,CaretLeft ,Gear, SignOut, Bell} from 'phosphor-react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileLawyer = () => {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLawyerData = async () => {
      try {
        const lawyerId = await AsyncStorage.getItem('lawyerId');
        if (!lawyerId) {
          throw new Error('Lawyer ID not found in storage');
        }

        const response = await fetch(`http://192.168.142.152:5000/api/lawyer/${lawyerId}`);
        
        // First check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debugging log

        if (!data.success || !data.lawyer) {
          throw new Error('Invalid response format from server');
        }

        setLawyer(data.lawyer);
      } catch (error) {
        console.error('Error fetching lawyer data:', error);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (!lawyer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load lawyer profile</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.replace('Profile')}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
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
        <Text style={styles.title}>Lawyer Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={lawyer.photo ? { uri: lawyer.photo } : require('../../assets/userprofile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{lawyer.name} {lawyer.surname}</Text>
        <Text style={styles.detail}>Email: {lawyer.email}</Text>
        <Text style={styles.detail}>Phone: {lawyer.phonenumb}</Text>
        <Text style={styles.detail}>Bar ID: {lawyer.idc}</Text>
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
         <TouchableOpacity style={styles.menuItem}>
        <MagicWand size={24} color="#003366" />
          <Text style={styles.menuText}>Level Up Your Profile </Text>
          <CaretRight size={24} color="#003366" />
        </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem}>
                  <Gear size={24} color="#003366" />
                  <Text style={styles.menuText}>Settings</Text>
                  <CaretRight size={24} color="#003366" />
                </TouchableOpacity>

       <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("SignIn")}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  menu: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#003366',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileLawyer;