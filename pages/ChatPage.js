import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { io } from 'socket.io-client';

const ChatPage = ({ route }) => {
  const { otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const socket = useRef(null);
  const scrollViewRef = useRef(null);

  const currentUserId = '680a845b03f27b89ec733469'; // Replace with actual user ID
  const API_URL = 'http://192.168.43.76:5000';

  useEffect(() => {
    const initiateConversation = async () => {
      try {
        const response = await fetch(`${API_URL}/api/initiateConversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId, lawyerId: otherUserId })
        });
        const data = await response.json();
        setConversationId(data.conversationId);
      } catch (error) {
        console.error('Error initiating conversation:', error);
      }
    };

    initiateConversation();
  }, [otherUserId]);

  useEffect(() => {
    if (conversationId) {
      socket.current = io(API_URL, {
        transports: ['websocket'],
      });

      socket.current.emit('joinConversation', conversationId);

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

      socket.current.on('receiveMessage', (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      return () => socket.current?.disconnect();
    }
  }, [conversationId]);

  const handleSend = () => {
    if (input.trim() && conversationId) {
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

  if (!conversationId) {
    return <Text>Initiating conversation...</Text>;
  }

  return (
    <View style={styles.container}>
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

export default ChatPage;
