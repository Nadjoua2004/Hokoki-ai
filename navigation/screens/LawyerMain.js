
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


export default function LawyerMain () {
  return (
    <View >
               <Text style={styles.title}> Lawyer Main Page</Text>
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
        marginTop: 20,
         marginBottom: 20,
      },
    });
