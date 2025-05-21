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
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import io from 'socket.io-client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatPage = ({ route, navigation }) => {
  const { conversationId, lawyerId, userId: otherParticipantId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [participantPhoto, setParticipantPhoto] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [isLoading, setIsLoading] = useState(true);
  const [isLawyer, setIsLawyer] = useState(false);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await AsyncStorage.getItem('userId');
      const userType = await AsyncStorage.getItem('userType');
      setCurrentUserId(id);
      setIsLawyer(userType === 'lawyer');
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchParticipantInfo = async () => {
      try {
        const endpoint = isLawyer 
          ? `http://192.168.142.1:5000/api/user/${otherParticipantId}`
          : `http://192.168.142.1:5000/api/lawyer/${lawyerId}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        const participant = isLawyer ? data.user : data.lawyer;
        setParticipantName(participant.name);
        setParticipantPhoto(participant.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
      } catch (error) {
        console.error('Failed to fetch participant details:', error);
      }
    };

    if (currentUserId) fetchParticipantInfo();
  }, [currentUserId, isLawyer, lawyerId, otherParticipantId]);

  useEffect(() => {
    if (currentUserId && conversationId) {
      const initializeChat = async () => {
        try {
          const [messagesRes, requestRes] = await Promise.all([
            fetch(`http://192.168.142.1:5000/api/conversation/${conversationId}/messages`),
            fetch(`http://192.168.142.1:5000/api/checkRequest?userId=${isLawyer ? otherParticipantId : currentUserId}&lawyerId=${lawyerId}`)
          ]);

          const messagesData = await messagesRes.json();
          const requestData = await requestRes.json();

          setMessages(messagesData.messages || []);
          setIsFirstMessage(messagesData.messages.length === 0 && !requestData.exists);
          
          socketRef.current = io('http://192.168.142.1:5000', {
            transports: ['websocket'],
          });

          socketRef.current.emit('login', { 
            userId: currentUserId, 
            role: isLawyer ? 'lawyer' : 'user' 
          });
          
          socketRef.current.emit('joinConversation', conversationId);

          socketRef.current.on('newMessage', (message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
          });
          setIsLoading(false);
          scrollToBottom();
        } catch (error) {
          console.error('Failed to initialize chat:', error);
          setIsLoading(false);
        }
      };

      initializeChat();

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [currentUserId, conversationId, lawyerId, isLawyer, otherParticipantId]);

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const handleCall = () => {
    // Implement your call functionality here
    Alert.alert('Call', 'Call functionality will be implemented here');
  };

  const handleVideoCall = () => {
    // Implement your video call functionality here
    Alert.alert('Video Call', 'Video call functionality will be implemented here');
  };

  const navigateToProfile = () => {
    if (!isLawyer) {
      navigation.navigate('LawyerProfile', { lawyerId });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (isFirstMessage) {
        const requestResponse = await fetch('http://192.168.142.1:5000/api/createRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: isLawyer ? otherParticipantId : currentUserId, 
            lawyerId,
            conversationId
          })
        });

        if (!requestResponse.ok) {
          throw new Error('Failed to create request');
        }

        Alert.alert('Request Sent', 'Your request has been sent. You can continue chatting.');
        setIsFirstMessage(false);
      }
      const messageResponse = await fetch('http://192.168.142.1:5000/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: currentUserId,
          receiverId: isLawyer ? otherParticipantId : lawyerId,
          senderModel: isLawyer ? 'Lawyer' : 'User',
          receiverModel: isLawyer ? 'User' : 'Lawyer',
          content: newMessage
        })
      });

      const messageData = await messageResponse.json();
      
      if (!messageResponse.ok) {
        throw new Error(messageData.message || 'Failed to send message');
      }

      socketRef.current.emit('sendMessage', messageData.message);
      setNewMessage('');
      Keyboard.dismiss();
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show(error.message || 'Failed to send message', ToastAndroid.SHORT);
    }
  };

  const renderMessage = ({ item }) => {
    const isSentByCurrentUser = 
      item.sender === currentUserId || 
      item.senderId === currentUserId ||
      (item.senderModel === 'Lawyer' && isLawyer) ||
      (item.senderModel === 'User' && !isLawyer);

    return (
      <View style={[
        styles.messageBubble,
        isSentByCurrentUser ? styles.sent : styles.received
      ]}>
        <Text style={isSentByCurrentUser ? styles.sentText : styles.receivedText}>
          {item.content}
        </Text>
        <Text style={[
          styles.timestamp,
          isSentByCurrentUser ? styles.sentTimestamp : styles.receivedTimestamp
        ]}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileInfo}
          onPress={navigateToProfile}
          disabled={isLawyer}
        >
          <Image source={{ uri: participantPhoto }} style={styles.profilePic} />
          <Text style={styles.name} numberOfLines={1}>{participantName}</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleCall} style={styles.iconButton}>
            <Ionicons name="call" size={22} color="#003366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoCall} style={styles.iconButton}>
            <Ionicons name="videocam" size={24} color="#003366" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({
          ios: 90,
          android: 0
        })}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor="#999"
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop:30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 80
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#003366',
    borderBottomRightRadius: 2,
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 2,
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
    fontSize: 11,
    marginTop: 4,
  },
  sentTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  receivedTimestamp: {
    color: '#999',
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.select({
      ios: 30,
      android: 12
    }),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatPage;