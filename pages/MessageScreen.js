import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageScreen = ({ route }) => {
  const { lawyer } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Message Screen</Text>
      {lawyer && (
        <View>
          <Text style={styles.details}>You are messaging: {lawyer.name}</Text>
          <Text style={styles.details}>Experience: {lawyer.experience}</Text>
          <Text style={styles.details}>Location: {lawyer.location}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
});

export default MessageScreen;
