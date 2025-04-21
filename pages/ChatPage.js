import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { text: 'Hi!', sender: 'me', time: '10:10' },
    { text: 'Hi, how can I help ?', sender: 'other', time: '10:11' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        sender: 'me',
        time: new Date().toLocaleTimeString().slice(0, 5),
      };
      setMessages([...messages, newMessage]);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backArrow}>{'\u2190'}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.name}>M. Djerbi Rachid</Text>
          <Text style={styles.status}>online</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messages}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === 'me' ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.time}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  backArrow: {
    fontSize: 24,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    fontSize: 12,
    color: 'green',
  },
  messages: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
  },
  time: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    padding: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatScreen;
