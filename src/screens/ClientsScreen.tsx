import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { User, MapPin } from 'lucide-react-native';
import { getClients, Client } from '../services/clientService';
import { useAuth } from '../hooks/useAuth';
import BackButton from '../components/BackButton';

/**
 * ClientsScreen Component
 * Displays a list of clients from the Smart Ops API
 */
export default function ClientsScreen({ navigation }: any) {
  const { token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load clients from API
   */
  const loadClients = async () => {
    try {
      setError(null);
      const data = await getClients(token || undefined);
      setClients(data);
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadClients();
  };

  useEffect(() => {
    loadClients();
  }, []);

  /**
   * Render individual client item
   */
  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity 
      style={styles.clientCard}
      onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}>
      <View style={styles.clientHeader}>
        <View style={styles.avatarContainer}>
          <User size={24} color="#ffffff" />
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>
            {item.companyName || 'No Company Name'}
          </Text>
        </View>
      </View>

      <View style={styles.clientDetails}>
        {/* {item.address && (
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.address}</Text>
          </View>
        )} */}
        {(item.city || item.state || item.zip) && (
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {[item.city, item.state, item.zip].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text style={styles.loadingText}>Loading clients...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadClients}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton textColor="#14b8a6" />
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#14b8a6']}
            tintColor="#14b8a6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No clients found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  clientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  clientCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  clientDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
