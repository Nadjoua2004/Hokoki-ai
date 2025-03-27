import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      {/* Username Input */}
      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} placeholder="Your username" placeholderTextColor="#aaa" />

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Your email" placeholderTextColor="#aaa" keyboardType="email-address" />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="●●●●●●●●"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Text>{passwordVisible ? "👁️" : "🙈"}</Text>
        </TouchableOpacity>
      </View>

      {/* Terms & Conditions Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
        <Text style={styles.checkboxText}>I accept the terms and privacy policy</Text>
      </View>

      {/* Log In Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>sing up</Text>
      </TouchableOpacity>

      {/* Already have an account? Log in */}
      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Text style={styles.linkText} onPress={() => navigation.navigate("SignIn")}>
          Log in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D1C2E",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#0D1C2E",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    fontSize: 14,
    color: "#0D1C2E",
  },
  button: {
    backgroundColor: "#002244",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomText: {
    textAlign: "center",
    color: "#0D1C2E",
  },
  linkText: {
    color: "#002244",
    fontWeight: "bold",
  },
});
