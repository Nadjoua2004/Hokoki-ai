import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  TextInput
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DocumentMain = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null); // null means all entities

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [documents, searchQuery, selectedEntity]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.142.152:5000/api/documents', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const documentsData = data.documents || [];
      const originalDocuments = documentsData.filter(doc => doc.type === 0);

      setDocuments(originalDocuments);
      setFilteredDocuments(originalDocuments);

    } catch (error) {
      console.error('[ERROR] Fetch error:', error);
      ToastAndroid.show('Failed to load documents', ToastAndroid.LONG);
      setDocuments([]);
      setFilteredDocuments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(text.toLowerCase());
      const matchesEntity = selectedEntity === null || doc.entity === selectedEntity;
      return matchesSearch && matchesEntity;
    });
    setFilteredDocuments(filtered);
  };

  const handleEntityFilter = (entityCode) => {
    setSelectedEntity(entityCode);
  };

  const handleDocumentPress = (document) => {
    navigation.navigate('DocumentDetail', {
      documentId: document.id,
      initialDocument: document
    });
  };

  const getEntityLabel = (entityCode) => {
    const entities = {
      1: 'Travail',
      2: 'Emploi',
      3: 'CNAS'
    };
    return entities[entityCode] || `Entity ${entityCode}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.documentContainer}
      onPress={() => handleDocumentPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.documentProfile}>
        <View style={styles.infoContainer}>
          {/* Add law number display here */}
          {item.number && (
            <Text style={styles.lawNumber}>
              Law No. {item.number}
            </Text>
          )}
          <Text style={styles.documentTitle}>
            {item.title}
          </Text>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="file-document" size={14} color="#666" />
            <Text style={styles.documentDetail}>
              Entity: {getEntityLabel(item.entity)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
      <View style={styles.header}>
        <Text style={styles.title}>Original Documents</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search documents..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />

      {/* Entity Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedEntity === null && styles.filterButtonActive]}
          onPress={() => handleEntityFilter(null)}
        >
          <Text style={[styles.filterButtonText, selectedEntity === null && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedEntity === 1 && styles.filterButtonActive]}
          onPress={() => handleEntityFilter(1)}
        >
          <Text style={[styles.filterButtonText, selectedEntity === 1 && styles.filterButtonTextActive]}>
            Travail
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedEntity === 2 && styles.filterButtonActive]}
          onPress={() => handleEntityFilter(2)}
        >
          <Text style={[styles.filterButtonText, selectedEntity === 2 && styles.filterButtonTextActive]}>
            Emploi
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedEntity === 3 && styles.filterButtonActive]}
          onPress={() => handleEntityFilter(3)}
        >
          <Text style={[styles.filterButtonText, selectedEntity === 3 && styles.filterButtonTextActive]}>
            CNAS
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDocuments}
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
                {filteredDocuments.length === 0 && documents.length === 0
                  ? 'No documents available'
                  : 'No matching documents found'}
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#003366',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  documentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
  },
  documentProfile: {
    flexDirection: 'row',
  },
  infoContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
  },
  lawNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 4,
  },
  documentTitle: {
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
  documentDetail: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flexShrink: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  }
});

export default DocumentMain;