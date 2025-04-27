
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


export default function ChatBot () {
  return (
    <View >
               <Text style={styles.title}>ChatBot </Text>
               </View>
  )
}
const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontWeight: "bold",
        color: "#003366",
        marginBottom: 20,
        marginTop: 20,
      },
    });
