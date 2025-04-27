
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


export default function Documments () {
  return (
    <View >
               <Text style={styles.title}>Documments page</Text>
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
