import React from 'react'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const logoImg = require()
const firstPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>23:58</Text>
      <View style={styles.content}>
        <Text style={styles.title}>Hokoki ai</Text>
        <Text style={styles.subtitle}>Algeria’s First AI-Powered Legal Assistant</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NextScreen')}>
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
export default firstPage