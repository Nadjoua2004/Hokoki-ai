import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false); // ✅ Track checkbox state

  const handleSignIn = () => {
    if (!agree) {
      ToastAndroid.show("You must agree to the terms before signing in!", ToastAndroid.SHORT);
      return;
    }

    console.log("Signing in...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

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

      {/* ✅ Checkbox for Terms Agreement */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={agree ? "checked" : "unchecked"}
          onPress={() => setAgree(!agree)}
          color="#fff"
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

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#003366",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxText: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  buttonText: {
    color: "#003366",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
});
