import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  Linking,
  RefreshControl,
  TextInput
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DocumentDetail = ({ route, navigation }) => {
  const { documentId, initialDocument } = route.params;
  const [document, setDocument] = useState(initialDocument || null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(!initialDocument);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null); // null means all types

  useEffect(() => {
    if (!initialDocument) {
      fetchDocument();
    }
    fetchRelatedDocuments();
  }, [documentId]);

  useEffect(() => {
    filterDocuments();
  }, [relatedDocuments, searchQuery, selectedType]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.142.1:5000/api/documents/${documentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDocument(data.document);
    } catch (err) {
      console.error('[ERROR] Fetch error:', err);
      setError('Failed to load document');
      ToastAndroid.show('Failed to load document', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedDocuments = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`http://192.168.142.1:5000/api/documents/related/${documentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRelatedDocuments(data.documents || []);
    } catch (err) {
      console.error('[ERROR] Fetch error:', err);
      setError('Failed to load related documents');
      ToastAndroid.show('Failed to load related documents', ToastAndroid.LONG);
    } finally {
      setRefreshing(false);
    }
  };

  const filterDocuments = () => {
    const filtered = relatedDocuments.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === null || doc.type === selectedType;
      return matchesSearch && matchesType;
    });
    setFilteredDocuments(filtered);
  };

  const handleRefresh = () => {
    if (!initialDocument) {
      fetchDocument();
    }
    fetchRelatedDocuments();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(prev => prev === type ? null : type);
  };

  const handleReadPdf = (pdfUrl) => {
    Linking.openURL(pdfUrl).catch(err => {
      console.error("Couldn't load page", err);
      ToastAndroid.show('Failed to open PDF', ToastAndroid.LONG);
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

  const getDocumentTypeLabel = (type) => {
    const types = {
      0: 'Original',
      1: 'Amendment',
      2: 'Repeal',
      3: 'Application'
    };
    return types[type] || `Type ${type}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.documentContainer}
      onPress={() => handleReadPdf(item.pdfUrl)}
    >
      <View style={styles.documentProfile}>
        <View style={styles.infoContainer}>
          <Text style={styles.documentTitle} numberOfLines={1}>
            {item.title}
          </Text>
          
          {item.number && (
            <Text style={styles.lawNumber}>
              Law No. {item.number}
            </Text>
          )}
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="office-building" size={14} color="#666" />
            <Text style={styles.documentDetail} numberOfLines={1}>
              Entity: {getEntityLabel(item.entity)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="file-document-outline" size={14} color="#666" />
            <Text style={styles.documentDetail}>
              Type: {getDocumentTypeLabel(item.type)}
            </Text>
          </View>
        </View>
        
        <MaterialCommunityIcons 
          name="file-pdf-box" 
          size={24} 
          color="#003366" 
          style={styles.pdfIcon}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Loading document...</Text>
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Document not found</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Document Details</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search related documents..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />

      {/* Type Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedType === null && styles.filterButtonActive]}
          onPress={() => handleTypeFilter(null)}
        >
          <Text style={[styles.filterButtonText, selectedType === null && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedType === 1 && styles.filterButtonActive]}
          onPress={() => handleTypeFilter(1)}
        >
          <Text style={[styles.filterButtonText, selectedType === 1 && styles.filterButtonTextActive]}>
            Amendment
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedType === 2 && styles.filterButtonActive]}
          onPress={() => handleTypeFilter(2)}
        >
          <Text style={[styles.filterButtonText, selectedType === 2 && styles.filterButtonTextActive]}>
            Repeal
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedType === 3 && styles.filterButtonActive]}
          onPress={() => handleTypeFilter(3)}
        >
          <Text style={[styles.filterButtonText, selectedType === 3 && styles.filterButtonTextActive]}>
            Application
          </Text>
        </TouchableOpacity>
      </View>

      {/* Original Document Section */}
      <Text style={styles.sectionHeader}>Original Document</Text>
      <View style={styles.documentContainer}>
        <TouchableOpacity onPress={() => handleReadPdf(document.pdfUrl)}>
          <View style={styles.documentProfile}>
            <View style={styles.infoContainer}>
              <Text style={styles.documentTitle} numberOfLines={1}>
                {document.title}
              </Text>

              {document.number && (
                <Text style={styles.lawNumber}>
                  Law No. {document.number}
                </Text>
              )}

              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="office-building" size={14} color="#666" />
                <Text style={styles.documentDetail} numberOfLines={1}>
                  Entity: {getEntityLabel(document.entity)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="file-document-outline" size={14} color="#666" />
                <Text style={styles.documentDetail}>
                  Type: {getDocumentTypeLabel(document.type)}
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons 
              name="file-pdf-box" 
              size={24} 
              color="#003366" 
              style={styles.pdfIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Related Documents Section */}
      <Text style={styles.sectionHeader}>
        Related Documents ({filteredDocuments.length})
      </Text>
      
      <FlatList
        data={filteredDocuments}
        renderItem={renderItem}
        keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#003366']}
          />
        }
        ListEmptyComponent={
          !refreshing && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {relatedDocuments.length === 0 
                  ? 'No related documents found' 
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
    paddingTop:30,
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
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
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  documentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  documentProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  lawNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  documentDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  pdfIcon: {
    marginLeft: 12,
    alignSelf: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 12,
  },
  retryText: {
    color: '#003366',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loadingText: {
    marginTop: 10,
    color: '#003366',
  }
});

export default DocumentDetail;