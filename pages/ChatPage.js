import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { io } from 'socket.io-client';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useRef(null);
  const scrollViewRef = useRef(null);

  // Replace these with your actual data
  const currentUserId = '68067bfe21021710f338754d';
  const otherUserId = '68067b1321021710f3387549';
  const conversationId = '6806b48347f3e3b81fdb9865';
  const API_URL = 'http://192.168.43.76:5000'; 

  useEffect(() => {
    // 1. Connect to Socket.IO
    socket.current = io(API_URL, {
      transports: ['websocket'],
    });

    // 2. Join conversation
    socket.current.emit('joinConversation', conversationId);

    // 3. Load message history
    const loadMessages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/conversation/${conversationId}/messages`
        );
        const { messages } = await response.json();
        setMessages(messages);
      } catch (error) {
        console.log('Error loading messages:', error);
      }
    };
    loadMessages();

    // 4. Listen for new messages
    socket.current.on('receiveMessage', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => socket.current?.disconnect();
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        conversationId,
        sender: currentUserId,
        receiver: otherUserId,
        content: input,
        timestamp: new Date().toISOString()
      };

      socket.current.emit('sendMessage', newMessage);
      setInput('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>M. Djerbi Rachid</Text>
        <Text style={styles.status}>online</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        onContentSizeChange={() => 
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === currentUserId ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={msg.sender === currentUserId ? styles.myMessageText : styles.otherMessageText}>
              {msg.content}
            </Text>
            <Text style={styles.time}>
              {formatTime(msg.timestamp)}
            </Text>
          </View>
        ))}
      </ScrollView>

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
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  status: {
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
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  time: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatScreen;