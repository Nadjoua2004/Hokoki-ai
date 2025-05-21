import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
  ToastAndroid
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LawyerAnonyme = ({ navigation }) => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      console.log('[DEBUG] Starting fetch...');

      const response = await fetch('http://192.168.142.1:5000/api/lawyers', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('[DEBUG] Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[DEBUG] Data received:', data);

      const lawyersData = data.lawyers || [];
      console.log('[DEBUG] Lawyers count:', lawyersData.length);

      const lawyersWithDefaults = lawyersData.map((lawyer, index) => ({
        ...lawyer,
        id: lawyer._id || lawyer.id || index.toString(),
        photo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default photo for all lawyers
        experienceYears: lawyer.experienceYears || 0,
        wilaya: lawyer.wilaya || 'Not specified',
        description: lawyer.description || 'No description provided',
        languages: lawyer.languages || [],
        anonymousIndex: index + 1 // Add index for anonymous search
      }));

      console.log('[DEBUG] Processed lawyers:', lawyersWithDefaults);
      setLawyers(lawyersWithDefaults);
      setFilteredLawyers(lawyersWithDefaults);

    } catch (error) {
      console.error('[ERROR] Fetch error:', error);
      ToastAndroid.show('Failed to load lawyers', ToastAndroid.LONG);
      setLawyers([]); // Ensure empty state is set on error
      setFilteredLawyers([]);
    } finally {
      console.log('[DEBUG] Fetch completed');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLawyers();
  };

  useEffect(() => {
    if (!searchText) {
      setFilteredLawyers(lawyers);
      return;
    }

    const searchTerm = searchText.toLowerCase();
    
    // Filter lawyers based on:
    // 1. Real name (name + surname)
    // 2. Anonymous index (e.g., "1", "lawyer 2", etc.)
    // 3. Wilaya (region)
    const filtered = lawyers.filter(lawyer => {
      // Check real name
      const fullName = `${lawyer.name || ''} ${lawyer.surname || ''}`.toLowerCase();
      const nameMatch = fullName.includes(searchTerm);
      
      // Check anonymous index
      const indexMatch = 
        searchTerm.includes(lawyer.anonymousIndex.toString()) || // "1", "2", etc.
        `lawyer ${lawyer.anonymousIndex}`.includes(searchTerm); // "lawyer 1", etc.
      
      // Check wilaya
      const wilayaMatch = lawyer.wilaya.toLowerCase().includes(searchTerm);
      
      return nameMatch || indexMatch || wilayaMatch;
    });
    
    setFilteredLawyers(filtered);
  }, [searchText, lawyers]);

  const renderItem = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const photoWidth = screenWidth * 0.2;
    const infoWidth = screenWidth * 0.6 - 30;
    const buttonWidth = screenWidth * 0.2 - 10;
  
    return (
      <View style={styles.lawyerContainer}>
        <View style={styles.lawyerProfile}>
          <View style={[styles.photoContainer, { width: photoWidth }]}>
            <Image
              source={{ uri: item.photo }}
              style={[styles.lawyerImage, { width: photoWidth - 20, height: photoWidth - 20 }]}
            />
          </View>
  
          <View style={[styles.infoContainer, { width: infoWidth }]}>
            <Text style={styles.lawyerName} numberOfLines={1} ellipsizeMode="tail">
              Anonymous Lawyer {item.anonymousIndex}
            </Text>
  
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
              <Text style={styles.lawyerDetail} numberOfLines={1} ellipsizeMode="tail">
                {item.wilaya}
              </Text>
            </View>
  
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="briefcase" size={14} color="#666" />
              <Text style={styles.lawyerDetail}>
                {item.experienceYears} {item.experienceYears === 1 ? 'year' : 'years'} experience
              </Text>
            </View>
          </View>
  
          <View style={[styles.buttonContainer, { width: buttonWidth }]}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('AnonymeProfile', {
                lawyer: item,
                anonymousName: `Anonymous Lawyer ${item.anonymousIndex}`
              })}
            >
              <MaterialCommunityIcons name="chevron-right" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search for a Lawyer</Text>
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={() => navigation.navigate('ChatPage')}
        >
          <MaterialCommunityIcons
            name="message-text-outline"
            size={28}
            color="#003366"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Find a Lawyer ....."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredLawyers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#003366']}
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {filteredLawyers.length === 0 && lawyers.length === 0
                  ? 'No lawyers available'
                  : 'No matching lawyers found'}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
  },
  messageIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  lawyerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 130,
    alignItems: 'center',
  },
  lawyerProfile: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lawyerImage: {
    borderRadius: 30,
  },
  infoContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
  },
  lawyerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lawyerDetail: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  profileButton: {
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  }
});

export default LawyerAnonyme;