
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ToastAndroid, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
//import { API_URL } from '../config';

export default function LogIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogIn = async () => {
    if (!email || !password) {
      ToastAndroid.show("Email and password are required!", ToastAndroid.SHORT);
      return;
    }
  
    // Define your primary and fallback URLs
    const urls = [
      'http://192.168.43.76:5000/api/Login',  // Primary URL
      'http://192.168.43.76:5000/api/lawyer/Login'    // Fallback URL
    ];
  
    let lastError = null;
  
    for (const url of urls) {
      try {
        setLoading(true);
        console.log(`Trying endpoint: ${url}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        // Handle response (text first, then JSON)
        const responseText = await response.text();
        let data;
        
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error(`Non-JSON response from ${url}:`, responseText);
          lastError = `Server error (invalid response from ${url})`;
          continue; // Try next URL
        }
  
        if (response.ok) {
          navigation.navigate('ChatPage');
          ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
          return; // Exit on success
        } else {
          lastError = data.message || `Login failed (Status: ${response.status})`;
        }
      } catch (error) {
        console.error(`Error with ${url}:`, error);
        lastError = `Connection failed to ${url}`;
      } finally {
        setLoading(false);
      }
    }
  
    // If we get here, all URLs failed
    ToastAndroid.show(
      lastError || 'All connection attempts failed', 
      ToastAndroid.LONG
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Hi, Welcome 👋</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />


<Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
            <Text style={styles.link1}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={handleLogIn}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// Keep your existing styles...

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
  label: {
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
    color: 'black',
  },
  title: {
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 28,
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
  link1: {
    marginTop: 10,
    marginBottom: 28,
    alignSelf: 'flex-start',
    marginLeft: 10,
    color: "#003366",
    fontSize: 16,
  },
});
