import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function LogIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false); 

 

  return (
    
   
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
                 <Text style={styles.link1}>Forgot password? </Text>
               </TouchableOpacity>

        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
        
        >
          Log in
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
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