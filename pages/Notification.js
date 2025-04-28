import React, { useState, useEffect } from 'react';

import { View, Text, FlatList, ActivityIndicator,TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Notifications = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lawyerId, setLawyerId] = useState(null);

  useEffect(() => {
    const fetchLawyerId = async () => {
      try {
        const id = await AsyncStorage.getItem('lawyerId');
        setLawyerId(id);
        if (id) {
          fetchRequests(id);
        }
      } catch (error) {
        console.error('Failed to fetch lawyer ID:', error);
      }
    };

    fetchLawyerId();
  }, []);

  const fetchRequests = async (lawyerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.43.76:5000/api/lawyerRequests/${lawyerId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      ToastAndroid.show('Failed to load requests', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await fetch('http://192.168.43.76:5000/api/updateRequestStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'accepted' }),
      });
      ToastAndroid.show('Request accepted!', ToastAndroid.SHORT);
      fetchRequests(lawyerId); // Refresh the list
    } catch (error) {
      console.error('Failed to accept request:', error);
      ToastAndroid.show('Failed to accept request', ToastAndroid.SHORT);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await fetch('http://192.168.43.76:5000/api/updateRequestStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'rejected' }),
      });
      ToastAndroid.show('Request rejected!', ToastAndroid.SHORT);
      fetchRequests(lawyerId); // Refresh the list
    } catch (error) {
      console.error('Failed to reject request:', error);
      ToastAndroid.show('Failed to reject request', ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.requestText}>{`User ${item.userId} wants to chat with you.`}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => acceptRequest(item._id)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => rejectRequest(item._id)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
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
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Notifications;
