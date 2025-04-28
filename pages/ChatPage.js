import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Alert
} from 'react-native';
import io from 'socket.io-client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatPage = ({ route }) => {
  const { conversationId, lawyerId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId && conversationId) {
      // Check if this is the first message in conversation
      const checkFirstMessage = async () => {
        try {
          const response = await fetch(
            `http://192.168.43.76:5000/api/conversation/${conversationId}/messages`
          );
          const data = await response.json();
          setIsFirstMessage(data.messages.length === 0);
        } catch (error) {
          console.error('Failed to check messages:', error);
        }
      };

      checkFirstMessage();

      // Setup socket connection
      socketRef.current = io('http://192.168.43.76:5000', {
        transports: ['websocket'],
      });

      socketRef.current.emit('joinConversation', conversationId);

      socketRef.current.on('newMessage', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      // Fetch existing messages
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://192.168.43.76:5000/api/conversation/${conversationId}/messages`
          );
          const data = await response.json();
          setMessages(data.messages || []);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };

      fetchMessages();

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [userId, conversationId]);

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // First, check if we need to create a request
      if (isFirstMessage) {
        const requestResponse = await fetch('http://192.168.43.76:5000/api/createRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            lawyerId
          })
        });

        if (!requestResponse.ok) {
          throw new Error('Failed to create request');
        }

        Alert.alert('Request Sent', 'Your request has been sent to the lawyer.');
        setIsFirstMessage(false);
      }

      // Then send the message
      const messageResponse = await fetch('http://192.168.43.76:5000/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: userId,
          receiverId: lawyerId,
          content: newMessage
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send message');
      }

      const messageData = await messageResponse.json();
      socketRef.current.emit('sendMessage', messageData.message);
      setNewMessage('');
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show('Failed to send message', ToastAndroid.SHORT);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === userId ? styles.sent : styles.received
    ]}>
      <Text style={item.sender === userId ? styles.sentText : styles.receivedText}>
        {item.content}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
       <View style={styles.header}>
    <TouchableOpacity>
      <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
    </TouchableOpacity>
    <View style={styles.profileInfo}>
      <View style={styles.profilePic} />
      <View>
        <Text style={styles.name}>M. Djerbi Rachid</Text>
        <Text style={styles.status}>online</Text>
      </View>
    </View>
  </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#003366',
    borderBottomRightRadius: 2,
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  sentText: {
    color: '#fff',
    fontSize: 16,
  },
  receivedText: {
    color: '#333',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatPage;
