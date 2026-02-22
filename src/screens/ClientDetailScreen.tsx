import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Building2, MapPin, User, Phone, Mail, Briefcase, Calendar } from 'lucide-react-native';
import { getClientById, Client } from '../services/clientService';
import { useAuth } from '../hooks/useAuth';
import BackButton from '../components/BackButton';

/**
 * ClientDetailScreen Component
 * Displays detailed information about a client including contacts and jobs
 */
export default function ClientDetailScreen({ route, navigation }: any) {
  const { clientId } = route.params;
  const { token } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  const loadClientDetails = async () => {
    try {
      setError(null);
      const data = await getClientById(clientId, token || undefined);
      setClient(data);
    } catch (err) {
      setError('Failed to load client details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text style={styles.loadingText}>Loading client details...</Text>
      </View>
    );
  }

  if (error || !client) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Client not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadClientDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton textColor="#14b8a6" />
      <ScrollView style={styles.scrollContainer}>
      {/* Client Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Building2 size={24} color="#14b8a6" />
          <Text style={styles.sectionTitle}>Client Information</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.companyName}>{client.companyName || 'No Company Name'}</Text>
          
          {client.address && (
            <View style={styles.infoRow}>
              <MapPin size={18} color="#6b7280" />
              <Text style={styles.infoText}>{client.address}</Text>
            </View>
          )}
          
          {(client.city || client.state || client.zip) && (
            <View style={styles.infoRow}>
              <MapPin size={18} color="#6b7280" />
              <Text style={styles.infoText}>
                {[client.city, client.state, client.zip].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Contacts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={24} color="#14b8a6" />
          <Text style={styles.sectionTitle}>Contacts ({client.contacts?.length || 0})</Text>
        </View>
        
        {client.contacts && client.contacts.length > 0 ? (
          client.contacts.map((contact) => (
            <View key={contact.id} style={styles.card}>
              <Text style={styles.contactName}>{contact.name}</Text>
              
              {contact.email && (
                <View style={styles.infoRow}>
                  <Mail size={16} color="#6b7280" />
                  <Text style={styles.infoText}>{contact.email}</Text>
                </View>
              )}
              
              {contact.phone && (
                <View style={styles.infoRow}>
                  <Phone size={16} color="#6b7280" />
                  <Text style={styles.infoText}>{contact.phone}</Text>
                </View>
              )}
              
              {contact.cellphone && (
                <View style={styles.infoRow}>
                  <Phone size={16} color="#6b7280" />
                  <Text style={styles.infoText}>{contact.cellphone} (Cell)</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No contacts found</Text>
          </View>
        )}
      </View>

      {/* Jobs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Briefcase size={24} color="#14b8a6" />
          <Text style={styles.sectionTitle}>Jobs ({client.jobs?.length || 0})</Text>
        </View>
        
        {client.jobs && client.jobs.length > 0 ? (
          client.jobs.map((job) => (
            <View key={job.id} style={styles.card}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobDescription}>
                  {job.description || 'No description'}
                </Text>
                {job.date && (
                  <View style={styles.dateContainer}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.dateText}>
                      {new Date(job.date).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
              
              {job.notes && (
                <Text style={styles.jobNotes}>{job.notes}</Text>
              )}
              
              {job.equipmentInstalled && job.equipmentInstalled.length > 0 && (
                <View style={styles.equipmentContainer}>
                  <Text style={styles.equipmentTitle}>Equipment Installed:</Text>
                  {job.equipmentInstalled.map((equipment, index) => (
                    <Text key={index} style={styles.equipmentItem}>• {equipment}</Text>
                  ))}
                </View>
              )}
              
              {job.invoiceId && (
                <Text style={styles.invoiceLink}>Invoice #{job.invoiceId}</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No jobs found</Text>
          </View>
        )}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  jobHeader: {
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  jobNotes: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
    fontStyle: 'italic',
  },
  equipmentContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  equipmentItem: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 8,
    marginTop: 2,
  },
  invoiceLink: {
    fontSize: 13,
    color: '#14b8a6',
    fontWeight: '600',
    marginTop: 8,
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
});
