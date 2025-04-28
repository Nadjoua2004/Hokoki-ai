import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
    
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LawyerProfile = ({ route, navigation }) => {
  const { lawyer } = route.params;

  const handleCallPress = () => {
    const phoneNumber = lawyer.phonenumb;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };
  const handleMessagePress = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const conversationId = await initiateConversation(userId, lawyer.id);

    navigation.navigate('ChatPage', {
      conversationId,
      userId,
      lawyerId: lawyer.id
    });
  } catch (error) {
    ToastAndroid.show(`Error starting chat: ${error.message}`, ToastAndroid.SHORT);
  }
};


  const initiateConversation = async (userId, lawyerId) => {
    try {
      const response = await fetch('http://192.168.43.76:5000/api/initiateConversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, lawyerId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.conversationId;
      } else {
        throw new Error(data.message || 'Failed to initiate conversation');
      }
    } catch (error) {
      console.error('Error initiating conversation:', error);
      throw error;
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lawyer Profile</Text>
        <View style={styles.backButton} /> {/* Empty view for spacing */}
      </View>

      <View style={styles.photoContainer}>
        <Image
          source={{ uri: lawyer.photo }}
          style={styles.profilePhoto}
        />
        <Text style={styles.lawyerName}>{lawyer.name} {lawyer.surname}</Text>
        <Text style={styles.specialty}>{lawyer.specialty || 'Specialty not specified'}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress}>
        <MaterialCommunityIcons name="send"   size={20}   color="#FFF"
            style={{ transform: [{ rotate: '315deg' }] }}
        />

          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
          <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutContainer}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutNumber}>{lawyer.clients || 0}</Text>
            <Text style={styles.aboutLabel}>Lawsuits</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutNumber}>{lawyer.cases || 0}+</Text>
            <Text style={styles.aboutLabel}>Achievements</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutNumber}>{lawyer.experienceYears || 0}+</Text>
            <Text style={styles.aboutLabel}>Experience</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#003366" />
          <Text style={styles.infoLabel}>Location: </Text>
          <Text style={styles.infoText}>{lawyer.wilaya || 'Not specified'}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="briefcase" size={20} color="#003366" />
          <Text style={styles.infoLabel}>Law Firm: </Text>
          <Text style={styles.infoText}>{lawyer.lawFirm || 'Not specified'}</Text>


</View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="email" size={20} color="#003366" />
          <Text style={styles.infoLabel}>Email: </Text>
          <Text style={styles.infoText}>{lawyer.email}{lawyer.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="phone" size={20} color="#003366" />
          <Text style={styles.infoLabel}>Phone: </Text>
          <Text style={styles.infoText}>{lawyer.phonenumb}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience Summary</Text>
        <Text style={styles.summaryText}>{lawyer.experienceSummary || 'No summary provided'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <View style={styles.languagesContainer}>
          {lawyer.languages && lawyer.languages.map((language, index) => (
            <View key={index} style={styles.languageTag}>
              <Text style={styles.languageText}>{language}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#003366',
    // iOS shadow
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  
    // Android elevation
    elevation: 20, 
  },
  lawyerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 5,
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 15,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#FFF', // القسم نفسه
    borderRadius: 10,
    padding: 15,
  
    // iOS shadow
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  
    // Android elevation
    elevation: 20, // كل ما زاد الرقم، كان الظل أوضح
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aboutItem: {
    alignItems: 'center',
    width: '30%',
  },
  aboutNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 5
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    backgroundColor: '#E1E9F7',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    color: '#003366',
    fontSize: 14,
  },
});

export default LawyerProfile;