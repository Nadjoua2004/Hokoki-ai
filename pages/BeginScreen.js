import React, { useState } from "react";
import { View, Text, StyleSheet, ToastAndroid, Platform, Alert, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function BeginScreen() {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [isPressed, setIsPressed] = useState(false); 

  const handleSignIn = () => {
    if (!checked) {
      if (Platform.OS === "android") {
        ToastAndroid.show("You must agree to the Terms & Conditions!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Notice", "You must agree to the Terms & Conditions!");
      }
      return;
    }
    navigation.navigate("SignIn"); // ✅ الانتقال إذا وافق المستخدم
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's Get Started!</Text>
      <Text style={styles.subtitle}>
        Sign in to access legal answers, chat with AI, and connect with lawyers.
      </Text>

      
      <TouchableOpacity
        style={[styles.button, isPressed && styles.buttonPressed]} 
        activeOpacity={0.7}
        onPress={handleSignIn}
        onPressIn={() => setIsPressed(true)}  // عند بدء الضغط
        onPressOut={() => setIsPressed(false)} // عند إنهاء الضغط
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
        />
        <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 124, 
    flex: 1,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    paddingBottom: 40, 
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 30,
  },
  
  button: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 198,
    width: 193,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
  buttonPressed: {
    backgroundColor: "transparent", 
    transform: [{ scale: 1 }], 
  },
  buttonText: {
    color: "#003366",
    fontSize: 20,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    color: "#fff",
  },
});
