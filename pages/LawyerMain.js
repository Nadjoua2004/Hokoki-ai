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
  Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../config';

const LawyerMain = ({ navigation }) => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLawyers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lawyers`);
      const data = await response.json();

      // Add default values
      const lawyersWithDefaults = data.map((lawyer, index) => ({
        ...lawyer,
        id: lawyer.id || index.toString(), // Ensure each lawyer has a unique id
        photo: lawyer.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        experienceYears: lawyer.experienceYears || 1,
        wilaya: lawyer.wilaya || 'Not specified'
      }));

      setLawyers(lawyersWithDefaults);
      setFilteredLawyers(lawyersWithDefaults);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  useEffect(() => {
    const filtered = lawyers.filter(lawyer => {
      const fullName = `${lawyer.name} ${lawyer.surname}`.toLowerCase();
      return fullName.includes(searchText.toLowerCase());
    });
    setFilteredLawyers(filtered);
  }, [searchText, lawyers]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLawyers();
  };

  const renderItem = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const photoWidth = screenWidth * 0.2; // 20% of screen width
    const infoWidth = screenWidth * 0.6 - 30; // 60% minus padding
    const buttonWidth = screenWidth * 0.2 - 10; // 20% minus padding

    return (
      <View style={styles.lawyerContainer}>
        <View style={styles.lawyerProfile}>
          {/* 20% width for photo */}
          <View style={[styles.photoContainer, { width: photoWidth }]}>
            <Image
              source={{ uri: item.photo }}
              style={[styles.lawyerImage, { width: photoWidth - 20, height: photoWidth - 20 }]}
            />
          </View>

          {/* 60% width for information */}
          <View style={[styles.infoContainer, { width: infoWidth }]}>
            <Text style={styles.lawyerName} numberOfLines={1} ellipsizeMode="tail">
              {item.name} {item.surname}
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

          {/* 20% width for button */}
          <View style={[styles.buttonContainer, { width: buttonWidth }]}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('LawyerProfile', { lawyer: item })}
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
      {/* Header with title and message icon */}
      <View style={styles.header}>
        <Text style={styles.title}>Search for a Lawyer </Text>
        <TouchableOpacity
          style={styles.messageIcon}
          onPress={() => navigation.navigate('Messages')}
        >
          <MaterialCommunityIcons
            name="message-text-outline"
            size={28}
            color="#003366"
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Find a Lawyer ......"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lawyers List */}
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lawyers found</Text>
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
    height:130,
    alignItems: 'center',
    position:'relative',
    justifyContent: 'center',
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
    borderRadius: 20,
    position: 'absolute',
    top:12,
    right: 10,
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

export default LawyerMain;
