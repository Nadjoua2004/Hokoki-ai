import React from 'react';
import { View, Text,Image, Button, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const First= require("../assets/first.png")
const Lawyer= require("../assets/lawyer.png")
const ChatBot= require("../assets/chatbot.png")
const ChatPrv= require("../assets/chatprv.png")




export default function OnboardingScreen({ navigation }) {
  return (
    <Swiper loop={false} showsPagination={true} 
    dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
      paginationStyle={{ bottom: 120 }} 
      >
      <View style={styles.slide}>
        <Text style={{paddingBottom: 40, lineHeight: 24,textAlign:'center',fontSize: 22,fontWeight: 'bold',color: 'white',}}>Welcome to Hokoki AI</Text>
        <Image source={First} style={{width:121,height:121,paddingBottom: 40} }/>
        <Text style={{ paddingTop: 40, paddingHorizontal: 16, lineHeight: 24,fontSize: 19,color: 'white', textAlign: 'center'} }>
          Get quick access to Algerian laws, legal answers, and expert guidance all in one place
          </Text>
      </View>

      <View style={styles.slide}>
        <Text style={{paddingBottom: 40, lineHeight: 24,fontSize: 22,fontWeight: 'bold',color: 'white',}}>
          Smart Legal Chatbot</Text>
        <Image source={ChatBot} style={{width:121,paddingBottom: 50,height:121} }/>
        <Text style={{paddingTop: 40,paddingHorizontal: 16, lineHeight: 24,fontSize: 19,color: 'white', textAlign: 'center'}}>
          Ask Hokoki AI about your legal concerns and receive answers with references to official laws</Text>
      </View>

      <View style={styles.slide}>
        <Text style={{paddingBottom: 40, lineHeight: 24,fontSize: 22,fontWeight: 'bold',color: 'white',}}>
          Find Lawyers Easily</Text>
        <Image source={Lawyer} style={{width:121,height:121,paddingBottom: 40} }/>
        <Text style={{paddingTop: 40,paddingHorizontal: 16, lineHeight: 24,fontSize: 19,color: 'white', textAlign: 'center'}}>
          Need professional help? Browse our lawyer directory by , location, and expertise</Text>
      </View>

      <View style={styles.slide}>
        <Text style={{paddingBottom: 40, lineHeight: 24,fontSize: 22,fontWeight: 'bold',color: 'white',}}>
          Private Chat with a Lawyer</Text>
        <Image source={ChatPrv} style={{width:121,height:121,paddingBottom: 50} }/>
        <Text style={{paddingTop: 50,paddingHorizontal: 16, lineHeight: 24,fontSize: 19,color: 'white', textAlign: 'center'}}>
          Connect with experienced lawyers through private chat for professional legal guidance</Text>
      </View>

    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#003366' },
  text: { color: '#fff', fontSize: 20,  gap:34, textAlign: 'center' },
  dot: {
    backgroundColor: '#8f8d8d', 
    width: 15, 
    height: 15, 
    borderRadius: 16, 
    margin: 10,
  },
  activeDot: {
    backgroundColor: 'white', 
    width: 16, 
    height: 16, 
    borderRadius: 13, 
    margin: 10,
  },
});
