import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const firstPage = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <Text style={styles.time}>23:58</Text>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <View style={styles.content}>
        <Text style={styles.title}>Hokoki AI</Text>
        <Text style={styles.subtitle}>Algeria’s First AI-Powered Legal Assistant</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SecondPage')}>
          <Text style={styles.buttonText}>Let’s get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002C5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    position: 'absolute',
    top: 40,
    left: 20,
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#002C5F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default firstPage;
