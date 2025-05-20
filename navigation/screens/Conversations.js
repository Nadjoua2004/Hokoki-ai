// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ConversationList = ({ navigation }) => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lawyerId, setLawyerId] = useState(null);

//   useEffect(() => {
//     const fetchLawyerId = async () => {
//       try {
//         const id = await AsyncStorage.getItem('lawyerId');
//         setLawyerId(id);
//         if (id) {
//           fetchConversations(id);
//         }
//       } catch (error) {
//         console.error('Failed to fetch lawyer ID:', error);
//       }
//     };

//     fetchLawyerId();
//   }, []);

//   const fetchConversations = async (lawyerId) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://192.168.43.76:5000/api/lawyer/${lawyerId}/conversations`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       console.log('Fetched conversations:', data); // Debugging log
      
//       // Ensure we have conversations and they're properly populated
//       const populatedConversations = await Promise.all(
//         (data.conversations || []).map(async (conv) => {
//           // Fetch user details for each participant
//           const participantsWithDetails = await Promise.all(
//             conv.participants.map(async (participantId) => {
//               try {
//                 const userResponse = await fetch(`http://192.168.43.76:5000/api/user/${participantId}`);
//                 if (userResponse.ok) {
//                   const userData = await userResponse.json();
//                   return { _id: participantId, name: userData.name || 'Unknown' };
//                 }
//                 return { _id: participantId, name: 'Unknown' };
//               } catch (error) {
//                 console.error('Error fetching user details:', error);
//                 return { _id: participantId, name: 'Unknown' };
//               }
//             })
//           );
//           return { ...conv, participants: participantsWithDetails };
//         })
//       );
      
//       setConversations(populatedConversations);
//     } catch (error) {
//       console.error('Failed to fetch conversations:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//     if (!item || !item._id) {
//       console.log('Undefined item:', item);
//       return null;
//     }
  
//     // Find the other participant (not the lawyer)
//     const otherParticipant = item.participants.find(p => p._id !== lawyerId);
//     const participantName = otherParticipant?.name || 'Unknown User';
  
//     return (
//       <TouchableOpacity
//         style={styles.conversationContainer}
//         onPress={() => navigation.navigate('ChatPage', { 
//           conversationId: item._id,
//           otherParticipantName: participantName 
//         })}
//       >
//         <Text style={styles.conversationText}>{participantName}</Text>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#003366" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Conversations</Text>
//       <FlatList
//         data={conversations}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()} // Fallback to index if item._id is undefined
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No conversations available</Text>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#003366',
//     marginBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   conversationContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   conversationText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default ConversationList;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConversationList = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lawyerId, setLawyerId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem('lawyerId');
        if (!id) throw new Error('No lawyer ID found');
        
        setLawyerId(id);
        await fetchConversations(id);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchConversations = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://192.168.43.76:5000/api/lawyer/${id}/conversations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate and sanitize data
      const safeConversations = (data.conversations || []).map(conv => ({
        _id: conv._id || Date.now().toString(),
        participants: Array.isArray(conv.participants) 
          ? conv.participants.map(p => ({
              _id: p._id || 'unknown',
              name: typeof p.name === 'string' ? p.name : 'Unknown User'
            }))
          : [],
        lastMessage: conv.lastMessage || 'No messages yet',
        updatedAt: conv.updatedAt || new Date().toISOString()
      }));

      setConversations(safeConversations);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load conversations. Pull to refresh.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

const renderItem = ({ item }) => {
  const otherParticipant = item.participants?.find(p => p._id !== lawyerId) || {};
  const participantName = otherParticipant.name || 'Unknown User';

  return (
    <TouchableOpacity
      style={styles.conversationContainer}
      onPress={() => navigation.navigate('ChatPage', { 
        conversationId: item._id,
        otherParticipantName: participantName 
      })}
    >
      <Text style={styles.conversationName}>{participantName}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage}
      </Text>
      <Text style={styles.timeText}>
        {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );
};
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Conversations</Text>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => lawyerId && fetchConversations(lawyerId)}
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
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  conversationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'right',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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