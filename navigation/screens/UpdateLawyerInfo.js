import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateLawyerInfo = ({ navigation }) => {
  const [lawyer, setLawyer] = useState({
    phonenumb: '',
    description: '',
    photo: null,
    experienceYears: 0,
    wilaya: '',
    languages: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const languagesList = [
    'English', 'French', 'Arabic', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese'
  ];

  useEffect(() => {
    const fetchLawyerData = async () => {
      try {
        const lawyerId = await AsyncStorage.getItem('lawyerId');
        console.log('Retrieved lawyerId from storage:', lawyerId);

        if (!lawyerId) {
          throw new Error('Lawyer ID not found in storage');
        }

        if (!/^[0-9a-fA-F]{24}$/.test(lawyerId)) {
          throw new Error('Invalid lawyer ID format');
        }

        const response = await fetch(`http://192.168.142.1:5000/api/lawyer/${lawyerId}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch lawyer data');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.success || !data.lawyer) {
          throw new Error('Invalid response format from server');
        }

        setLawyer({
          phonenumb: data.lawyer.phonenumb || '',
          description: data.lawyer.description || '',
          photo: data.lawyer.photo || null,
          experienceYears: data.lawyer.experienceYears || 0,
          wilaya: data.lawyer.wilaya || '',
          languages: data.lawyer.languages || []
        });

        console.log('Lawyer Photo URL:', data.lawyer.photo);
      } catch (error) {
        console.error('Error fetching lawyer data:', error);
        Alert.alert('Error', error.message || 'Failed to load profile data');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyerData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const lawyerId = await AsyncStorage.getItem('lawyerId');
      if (!lawyerId) {
        throw new Error('Lawyer ID not found in storage');
      }

      // Phone number validation
      if (lawyer.phonenumb && !/^[0-9]{10}$/.test(lawyer.phonenumb)) {
        throw new Error('Phone number must be 10 digits');
      }

      // Experience validation
      if (lawyer.experienceYears < 0 || lawyer.experienceYears > 50) {
        throw new Error('Experience must be between 0 and 50 years');
      }

      // Wilaya validation
      if (!lawyer.wilaya) {
        throw new Error('Wilaya is required');
      }

      const response = await fetch(
        `http://192.168.142.1:5000/api/lawyer/${lawyerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phonenumb: lawyer.phonenumb,
            description: lawyer.description,
            experienceYears: lawyer.experienceYears,
            wilaya: lawyer.wilaya,
            languages: lawyer.languages
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLanguage = (language) => {
    setLawyer(prevLawyer => {
      const languages = prevLawyer.languages.includes(language)
        ? prevLawyer.languages.filter(lang => lang !== language)
        : [...prevLawyer.languages, language];
      return { ...prevLawyer, languages };
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Profile</Text>

        <Image
          source={
            lawyer.photo
              ? { uri: lawyer.photo }
              : require('../../assets/userprofile.png')
          }
          style={styles.profileImage}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={lawyer.phonenumb}
          onChangeText={(text) => setLawyer({ ...lawyer, phonenumb: text })}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell about your expertise"
          multiline
          numberOfLines={4}
          value={lawyer.description}
          onChangeText={(text) => setLawyer({ ...lawyer, description: text })}
        />

        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          keyboardType="numeric"
          maxLength={2}
          value={lawyer.experienceYears.toString()}
          onChangeText={(text) => {
            const num = parseInt(text) || 0;
            setLawyer({ ...lawyer, experienceYears: Math.min(num, 50) });
          }}
        />

        <Text style={styles.label}>Wilaya</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your wilaya"
          value={lawyer.wilaya}
          onChangeText={(text) => setLawyer({ ...lawyer, wilaya: text })}
          onSubmitEditing={() => {}}
        />

        <Text style={styles.label}>Languages</Text>
        <View style={styles.languagesContainer}>
          {languagesList.map((item) => (
            <TouchableHighlight
              key={item}
              style={[
                styles.languageItem,
                lawyer.languages.includes(item) && styles.selectedLanguage
              ]}
              onPress={() => toggleLanguage(item)}
              underlayColor="#ddd"
            >
              <Text style={[
                styles.languageText,
                lawyer.languages.includes(item) && styles.selectedLanguageText
              ]}>
                {item}
              </Text>
            </TouchableHighlight>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isSaving && styles.disabledButton
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#003366'
  },
  label: {
    fontSize: 16,
    color: '#003366',
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#7a9cc6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  languageItem: {
    width: '30%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  languageText: {
    fontSize: 16,
    color: '#003366',
  },
  selectedLanguageText: {
    color: '#fff',
  },
});

export default UpdateLawyerInfo;