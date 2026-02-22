import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IdCard } from 'lucide-react-native';
import BackButton from '../components/BackButton';

/**
 * TechnicianScreen Component
 * Manage technicians/employees
 */
export default function TechnicianScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <BackButton textColor="#14b8a6" />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <IdCard size={64} color="#14b8a6" />
        </View>
        <Text style={styles.title}>Technician Management</Text>
        <Text style={styles.description}>
          Technician management feature coming soon. Manage your team,
          assignments, and performance.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Planned Features:</Text>
          <Text style={styles.featureItem}>• View all technicians</Text>
          <Text style={styles.featureItem}>• Add/edit technician profiles</Text>
          <Text style={styles.featureItem}>• Track certifications and skills</Text>
          <Text style={styles.featureItem}>• Assign jobs and appointments</Text>
          <Text style={styles.featureItem}>• Monitor work hours</Text>
          <Text style={styles.featureItem}>• Performance metrics</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featureList: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 24,
  },
});
