// ConversationList.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl,
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ConversationList = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLawyer, setIsLawyer] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const userType = await AsyncStorage.getItem('userType');
        
        if (!id) throw new Error('No user ID found');
        
        setCurrentUserId(id);
        setIsLawyer(userType === 'lawyer');
        await fetchConversations(id, userType);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchConversations = async (id, userType) => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
  
      const endpoint = userType === 'lawyer' 
        ? `http://192.168.142.1:5000/api/lawyer/${id}/conversations`
        : `http://192.168.142.1:5000/api/user/${id}/conversations`;
  
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Process conversations to find the other participant
      const processedConversations = (data.conversations || []).map(conv => {
        const otherParticipant = conv.participants?.find(p => p._id !== id) || {};
        const lawyerParticipant = conv.participants?.find(p => p.userType === 'lawyer') || {};
        
        return {
          _id: conv._id,
          otherParticipant: {
            _id: otherParticipant._id || lawyerParticipant._id || 'unknown',
            name: otherParticipant.userType === 'lawyer' 
              ? `Anonymous Lawyer ${lawyerParticipant.anonymousNumber || 1}`
              : otherParticipant.name || 'Unknown',
            photo: otherParticipant.photo || lawyerParticipant.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            userType: otherParticipant.userType || lawyerParticipant.userType
          },
          lastMessage: conv.lastMessage?.content || 'No messages yet',
          updatedAt: conv.updatedAt || new Date().toISOString()
        };
      });
  
      setConversations(processedConversations);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load conversations. Pull to refresh.');
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.conversationContainer}
        onPress={() => navigation.navigate('ChatPage', { 
          conversationId: item._id,
          lawyerId: isLawyer ? currentUserId : item.otherParticipant._id,
          userId: isLawyer ? item.otherParticipant._id : currentUserId
        })}
      >
        <View style={styles.conversationHeader}>
          <Image 
            source={{ uri: item.otherParticipant.photo }}
            style={styles.profileImage}
          />
          <View style={styles.conversationInfo}>
            <Text style={styles.conversationName}>{item.otherParticipant.name}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Conversations</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => currentUserId && fetchConversations(currentUserId, isLawyer ? 'lawyer' : 'user')}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error ? '' : 'No conversations yet'}
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => currentUserId && fetchConversations(currentUserId, isLawyer ? 'lawyer' : 'user')}
            colors={['#003366']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    marginVertical: 20,
    paddingHorizontal: 8,
    paddingTop:20,
  },
  listContainer: {
    paddingBottom: 20,
    marginTop:20,
  },
  conversationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B',
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#003366',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ConversationList;