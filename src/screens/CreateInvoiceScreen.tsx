import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FilePlus } from 'lucide-react-native';
import BackButton from '../components/BackButton';

/**
 * CreateInvoiceScreen Component
 * Form to create new invoices
 */
export default function CreateInvoiceScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <BackButton textColor="#14b8a6" />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <FilePlus size={64} color="#14b8a6" />
        </View>
        <Text style={styles.title}>Create Invoice</Text>
        <Text style={styles.description}>
          Invoice creation feature coming soon. This will allow you to create
          professional invoices for your clients.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Planned Features:</Text>
          <Text style={styles.featureItem}>• Select client from list</Text>
          <Text style={styles.featureItem}>• Add products and services</Text>
          <Text style={styles.featureItem}>• Calculate totals and taxes</Text>
          <Text style={styles.featureItem}>• Add custom notes and terms</Text>
          <Text style={styles.featureItem}>• Save as draft or send immediately</Text>
          <Text style={styles.featureItem}>• Export as PDF</Text>
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
