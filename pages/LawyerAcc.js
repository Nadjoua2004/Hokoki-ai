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
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();
const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phonenumb, setPhonenumb] = useState("");
  const [password, setPassword] = useState("");
  const [idc, setIdc] = useState("");
  const [agree, setAgree] = useState(false); 

  const handleSignIn = async () => {
    console.log({ name, surname, phonenumb, email, password,idc, agree });
      if (!agree) {
        ToastAndroid.show("You must agree to the terms!", ToastAndroid.SHORT);
        return;
      }
    
     
      if (!name || !surname || !phonenumb || !email || !password || !idc) {
        ToastAndroid.show("All fields are required!", ToastAndroid.SHORT);
        return;
      }
    
      try {
       
        const response = await fetch('http://192.168.43.76:5000/api/lawyer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            surname,
            phonenumb,
            email,
            password,
            idc,
            agree: agree

          }),
        });
    
        const data = await response.json();
    
        // . Handle response
        if (response.ok) {
          ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
          navigation.navigate('ChatPage'); 
        } else {
          ToastAndroid.show(data.message || 'Registration failed', ToastAndroid.SHORT);
        }
      } catch (error) {
        // 5. Network/other errors
        ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.SHORT);
        console.error('Registration error:', error);
      }
    };
  
  return( 
  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50,paddingTop: 30 }}
  keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Create Lawyer account</Text>
  
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
            />
  
            <TextInput
              style={styles.input}
              placeholder="Your Surname"
              placeholderTextColor="#ccc"
              value={surname}
              onChangeText={setSurname}
            />
  
            <TextInput
              style={styles.input}
              placeholder="Your Number"
              placeholderTextColor="#ccc"
              value={phonenumb}
              onChangeText={setPhonenumb}
              keyboardType="phone-pad"
            />
  
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
  
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
  
            <TextInput
              style={styles.input}
              placeholder="ID of your CAPA certifecate"
              placeholderTextColor="#ccc"
              value={idc}
              onChangeText={setIdc}
              secureTextEntry
            />
  
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agree ? "checked" : "unchecked"}
                onPress={() => setAgree(!agree)}
                color="#003366"
              />
              <Text style={styles.checkboxText}>
                I agree to the Terms & Conditions
              </Text>
            </View>
  
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={handleSignIn}
            >
              Sign In
            </Button>
  
            <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
              <Text style={styles.link}>
                Already have an account? Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  link1: {
    marginTop: 40,
    color: "#003366",
    fontSize: 18,
  },
});