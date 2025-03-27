import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import BeginScreen from "../pages/BeginScreen.js";
import SignIn from "../pages/SignIn.js"; 
const First = require("../assets/first.png");
const Lawyer = require("../assets/lawyer.png");
const ChatBot = require("../assets/chatbot.png");
const ChatPrv = require("../assets/chatprv.png");

export default function OnboardingScreen({ navigation }) {
  const [showPagination, setShowPagination] = useState(true);

  return (
    
    <Swiper
    loop={false}
    showsPagination={showPagination} // Show dots based on state
    dot={<View style={styles.dot} />}
    activeDot={<View style={styles.activeDot} />}
    paginationStyle={{ bottom: 120 }}
    onIndexChanged={(index) => setShowPagination(index !== 4)} // Hide dots on last slide
  >
  


      <View style={styles.slide}>
        <Text style={styles.title}>Welcome to Hokoki AI</Text>
        <Image source={First} style={styles.image} />
        <Text style={styles.text}>Get quick access to Algerian laws, legal answers, and expert guidance all in one place</Text>
      </View>

      <View style={styles.slide}>
        <Text style={styles.title}>Smart Legal Chatbot</Text>
        <Image source={ChatBot} style={styles.image} />
        <Text style={styles.text}>Ask Hokoki AI about your legal concerns and receive answers with references to official laws</Text>
      </View>

      <View style={styles.slide}>
        <Text style={styles.title}>Find Lawyers Easily</Text>
        <Image source={Lawyer} style={styles.image} />
        <Text style={styles.text}>Need professional help? Browse our lawyer directory by location and expertise</Text>
      </View>

      <View style={styles.slide}>
        <Text style={styles.title}>Private Chat with a Lawyer</Text>
        <Image source={ChatPrv} style={styles.image} />
        <Text style={styles.text}>Connect with experienced lawyers through private chat for professional legal guidance</Text>
      </View>

      {/* Last Slide - Show BeginScreen Without Dots */}
      <View style={styles.fullScreenSlide}>
      <BeginScreen navigation={navigation} />;
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#003366' },
  fullScreenSlide: { flex: 1, backgroundColor: '#003366' }, // No padding to match full-screen effect
  title: { paddingBottom: 40, lineHeight: 24, fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  image: { width: 121, height: 121, marginBottom: 40 },
  text: { paddingTop: 40, paddingHorizontal: 16, lineHeight: 24, fontSize: 19, color: 'white', textAlign: 'center' },
  dot: { backgroundColor: '#8f8d8d', width: 15, height: 15, borderRadius: 16, margin: 10 },
  activeDot: { backgroundColor: 'white', width: 16, height: 16, borderRadius: 13, margin: 10 },
});
