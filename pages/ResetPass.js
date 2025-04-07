import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function ResetPass() {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(false); 

  
 
  return (
   
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Forgot Password</Text>
         <Text style={styles.label2}> Please type something you’ll remember</Text>
      
        
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#ccc"
          value={newPassword}
          onChangeText={setNewPassword}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new Password"
          placeholderTextColor="#ccc"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboardType="email-address"
        />
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
          
        >
          Reset Password
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
          <Text style={styles.link}>Remember password? Log in</Text>
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
  label2: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 45,
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