import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  ToastAndroid,
  RefreshControl 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const API_BASE_URL = 'http://192.168.142.1:5000'; 

const Notifications = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lawyerId, setLawyerId] = useState(null);
  const [error, setError] = useState(null);

  const fetchLawyerId = async () => {
    try {
      const id = await AsyncStorage.getItem('lawyerId');
      if (!id) throw new Error('No lawyer ID found');
      setLawyerId(id);
      return id;
    } catch (error) {
      console.error('Failed to fetch lawyer ID:', error);
      setError('Failed to load your profile');
      throw error;
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
      if (!response.ok) {
        throw new Error(`User fetch failed with status ${response.status}`);
      }
      const userData = await response.json();
      return userData.user ? `${userData.user.name} ${userData.user.surname}` : 'Unknown User';
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return 'Unknown User';
    }
  };

  const fetchRequests = async (lawyerId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/lawyerRequests/${lawyerId}`);
      
      if (!response.ok) {
        // Handle 500 errors specifically
        if (response.status === 500) {
          throw new Error('Server error - please try again later');
        }
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      
      // Handle case where data is empty
      if (!data || data.length === 0) {
        setRequests([]);
        return;
      }

      // Process requests in batches to avoid overwhelming the network
      const batchSize = 5;
      const batches = [];
      for (let i = 0; i < data.length; i += batchSize) {
        batches.push(data.slice(i, i + batchSize));
      }

      let processedRequests = [];
      for (const batch of batches) {
        const batchWithDetails = await Promise.all(
          batch.map(async (request) => ({
            ...request,
            userName: await fetchUserDetails(request.userId)
          }))
        );
        processedRequests = [...processedRequests, ...batchWithDetails];
      }

      setRequests(processedRequests);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (lawyerId) {
      await fetchRequests(lawyerId, true);
    }
  };

  const updateRequestStatus = async (requestId, status, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/updateRequestStatus`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestId, status }),
      });
  
      if (!response.ok) {
        throw new Error(`Status update failed with status ${response.status}`);
      }
  
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Request update failed');
      }
  
      ToastAndroid.show(`Request ${status}!`, ToastAndroid.SHORT);
      
      // Remove the request from the list
      setRequests(prev => prev.filter(req => req._id !== requestId));
  
      // If accepted, navigate to chat
      if (status === 'accepted' && result.conversationId) {
        navigation.navigate('ChatPage', {
          conversationId: result.conversationId,
          lawyerId,
          userId
        });
      }
    } catch (error) {
      console.error(`Failed to ${status} request:`, error);
      ToastAndroid.show(`Failed to ${status} request`, ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const id = await fetchLawyerId();
        await fetchRequests(id);
      } catch (error) {
        setLoading(false);
      }
    };

    initialize();

    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      if (lawyerId) fetchRequests(lawyerId);
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.requestText}>
        {item.userName} wants to chat with you.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={() => updateRequestStatus(item._id, 'accepted', item.userId)}
          disabled={refreshing}
        >
          <MaterialCommunityIcons name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}> Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.rejectButton} 
          onPress={() => updateRequestStatus(item._id, 'rejected')}
          disabled={refreshing}
        >
          <MaterialCommunityIcons name="close" size={20} color="#fff" />
          <Text style={styles.buttonText}> Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat Requests</Text>
        <TouchableOpacity 
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <MaterialCommunityIcons 
            name="refresh" 
            size={24} 
            color="#003366" 
            style={refreshing && styles.refreshingIcon} 
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => lawyerId && fetchRequests(lawyerId)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

<FlatList
  data={requests}
  renderItem={renderItem}
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
      {error ? (
        <>
          <MaterialCommunityIcons name="alert-circle" size={40} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchRequests(lawyerId)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <MaterialCommunityIcons name="bell-off" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No pending requests</Text>
        </>
      )}
    </View>
  }
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  requestContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Notifications;