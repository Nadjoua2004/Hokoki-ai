import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from '../config';

export default function LawyerSignUp() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phonenumb: "",
    idcapa: "",
    email: "",
    password: "",
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    // Validate agreement
    if (!formData.agreeToTerms) {
      ToastAndroid.show("You must agree to the terms!", ToastAndroid.SHORT);
      return;
    }

    // Validate required fields
    const requiredFields = ['name', 'surname', 'phonenumb', 'idcapa', 'email', 'password'];
    const missingField = requiredFields.find(field => !formData[field]?.trim());
    
    if (missingField) {
      const fieldName = missingField === 'idcapa' ? 'CAPA Certificate ID' : missingField;
      ToastAndroid.show(`Please fill in ${fieldName}`, ToastAndroid.SHORT);
      return;
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      ToastAndroid.show("Please enter a valid email address", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/lawyer/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      ToastAndroid.show('Lawyer registration successful!', ToastAndroid.SHORT);
      navigation.navigate('Welcome');
      
    } catch (error) {
      console.error('Registration error:', error);
      ToastAndroid.show(
        error.message || 'Registration failed. Please try again.',
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Lawyer Registration</Text>

        {[
          { field: 'name', placeholder: 'Your Name' },
          { field: 'surname', placeholder: 'Your Surname' },
          { field: 'phonenumb', placeholder: 'Phone Number', keyboardType: 'phone-pad' },
          { field: 'idcapa', placeholder: 'CAPA Certificate ID' },
          { field: 'email', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
          { field: 'password', placeholder: 'Password', secureTextEntry: true }
        ].map(({ field, placeholder, ...props }) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#ccc"
            value={formData[field]}
            onChangeText={(text) => handleChange(field, text)}
            {...props}
          />
        ))}

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={formData.agreeToTerms ? "checked" : "unchecked"}
            onPress={() => handleChange('agreeToTerms', !formData.agreeToTerms)}
            color='#003366'
          />
          <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
        </View>

        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>

        {loading && <ActivityIndicator style={styles.loader} color="#003366" />}

        <TouchableOpacity 
          onPress={() => navigation.navigate("LogIn")}
          style={styles.loginLink}
          disabled={loading}
        >
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9FF",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
  },
  input: { 
    width: 300,
    height: 50,
    backgroundColor: "#fff",
    borderColor: '#000001',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#003366",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 15,
    width: 300,
  },
  checkboxText: {
    color: "#003366",
    fontSize: 14,
  },
  button: {
    backgroundColor: '#003366',
    width: 300,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 80,
    color: "#003366",
    fontSize: 16,
  },
});