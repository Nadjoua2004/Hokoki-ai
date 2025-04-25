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
        // Navigate to ChatScreen with a dummy lawyer ID for testing
        navigation.navigate('ChatPage', {
          otherUserId: '68067b1321021710f3387549' // Replace with actual lawyer ID
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
        <ScrollView contentContainerStyle={[styles.innerContainer, ]}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Create account</Text>

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
