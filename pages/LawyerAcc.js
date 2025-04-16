import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [agree, setAgree] = useState(false); 

  const handleSignIn = () => {
    if (!agree) {
      ToastAndroid.show("You must agree to the terms before signing in!", ToastAndroid.SHORT);
      return;
    }
    console.log("Signing in...");
  };

  return (
   
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create Lawyer account</Text>
        
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Your username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        <Text style={styles.label}>ID CAPA</Text>
        <TextInput
          style={styles.input}
          placeholder="ID of your CAPA certifecate"
          placeholderTextColor="#ccc"
          value={id}
          onChangeText={setId}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agree ? "checked" : "unchecked"}
            onPress={() => setAgree(!agree)}
            color='#003366'
          />
          <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
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
          <Text style={styles.link}>Already have an account?  Log in</Text>
        </TouchableOpacity>
      </View>
  
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