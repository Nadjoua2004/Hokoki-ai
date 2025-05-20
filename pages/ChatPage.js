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
  Alert,
  Keyboard,
  Image,
  SafeAreaView
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
  const [lawyerName, setLawyerName] = useState('');
  const [lawyerPhoto, setLawyerPhoto] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);

      if (id && socketRef.current) {
        socketRef.current.emit('login', { userId: id, role: 'user' });
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        const response = await fetch(`http://192.168.43.76:5000/api/lawyer/${lawyerId}`);
        const data = await response.json();
        setLawyerName(data.lawyer.name);
        setLawyerPhoto(data.lawyer.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
      } catch (error) {
        console.error('Failed to fetch lawyer details:', error);
      }
    };

    fetchLawyerDetails();
  }, [lawyerId]);

  useEffect(() => {
    if (userId && conversationId) {
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

      socketRef.current = io('http://192.168.43.76:5000', {
        transports: ['websocket'],
      });

      socketRef.current.emit('login', { userId, role: 'user' });
      socketRef.current.emit('joinConversation', conversationId);

      socketRef.current.on('newMessage', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

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
      Keyboard.dismiss();
      setTimeout(scrollToBottom, 100);
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
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image source={{ uri: lawyerPhoto }} style={styles.profilePic} />
          <Text style={styles.name}>{lawyerName}</Text>
        </View>
      </View>

      {/* Messages Area */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({
          ios: 90,
          android: 0
        })}
      >
        <View style={styles.messagesWrapper}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            multiline
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={24} 
              color={newMessage.trim() ? '#fff' : '#ccc'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  messagesWrapper: {
    flex: 1,
    paddingBottom: 10,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 70, // Add extra padding at the bottom
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
    paddingBottom: Platform.select({
      ios: 25,
      android: 10
    }),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: Platform.select({
      ios: 10,
      android: 8
    }),
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatPage;