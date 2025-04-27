import React, { useState } from "react";
import { Eye, EyeSlash } from 'phosphor-react-native';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Checkbox, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phonenumb, setPhonenumb] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSignIn = async () => {
    if (!agree) {
      ToastAndroid.show("You must agree to the terms!", ToastAndroid.SHORT);
      return;
    }

    if (!name.trim() || !surname.trim() || !phonenumb.trim() || !email.trim() || !password.trim()) {
      ToastAndroid.show("All fields are required!", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await fetch('http://192.168.43.76:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          surname: surname.trim(),
          phonenumb: phonenumb.trim(),
          email: email.trim(),
          password: password.trim(),
          agree
        }),
      });

      const data = await response.json();

      if (response.ok) {
        ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
        await AsyncStorage.setItem('userId', data.user.id);
        navigation.navigate('MainContainer', {
          otherUserId: '68067b1321021710f3387549'
        });
      } else {
        ToastAndroid.show(data.message || 'Registration failed', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.SHORT);
      console.error('Registration error:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image 
            source={require('../assets/Star.png')} 
            style={[styles.logo, { tintColor: '#003366' }]} 
          />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Create account</Text>

            <RNTextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
            />

            <RNTextInput
              style={styles.input}
              placeholder="Your Surname"
              placeholderTextColor="#ccc"
              value={surname}
              onChangeText={setSurname}
            />

            <RNTextInput
              style={styles.input}
              placeholder="Your Number"
              placeholderTextColor="#ccc"
              value={phonenumb}
              onChangeText={setPhonenumb}
              keyboardType="phone-pad"
            />

            <RNTextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

<TextInput
  mode="flat" 
  style={[styles.input, { backgroundColor: '#fff' }]}
  placeholder="Password"
  secureTextEntry={!passwordVisible}
  right={
    <TextInput.Icon
      icon={passwordVisible ? () => <EyeSlash size={20} color="#003366" /> : () => <Eye size={20} color="#003366" />}
      onPress={() => setPasswordVisible(!passwordVisible)}
    />
  }
  placeholderTextColor="#ccc"
  value={password}
  onChangeText={setPassword}
  theme={{ 
    colors: { 
      text: '#003366',
      background: 'transparent' 
    } 
  }}
  underlineColor="transparent" 
  activeUnderlineColor="transparent" 
/>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agree ? "checked" : "unchecked"}
                onPress={() => setAgree(!agree)}
                color="#003366"
              />
              <TouchableOpacity onPress={() => navigation.navigate("termsConditions")}>
                <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={handleSignIn}
            >
              Sign In
            </Button>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LawyerAcc")}>
              <Text style={styles.buttonText}> Are you a lawyer?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
    justifyContent: "center",
    backgroundColor: "#F6F9FF",
  },
  innerContainer: {
    alignItems: "center",
    paddingHorizontal: 18,
  },
  label: {
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
    color: "black",
  },
  title: {
    fontSize: 30,
    alignSelf: "flex-start",
    marginLeft: 10,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    paddingTop: 37,
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#000001",
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
  logo: {
    width: 28,
    height: 28,
    marginLeft: 290,
    marginBottom: 10,
    color: "#003366",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#003366",
    width: 300,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    marginTop: 60,
    color: "#003366",
    fontSize: 16,
  },
  link1: {
    marginTop: 40,
    color: "#003366",
    fontSize: 18,
  },
});
