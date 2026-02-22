import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Send, SendHorizontal, DollarSign, CircleDollarSign, Users, Package, Calendar, IdCard } from 'lucide-react-native';

/**
 * AdminDashboard Component
 * Dashboard for admin users
 */
export default function AdminDashboard({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Admin Features</Text>
        <Text style={styles.info}>
          Manage your business operations from here.
        </Text>
        
        {/* Admin feature cards */}
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Clients')}>
          <View style={styles.cardHeader}>
            <Users size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Clients</Text>
              <Text style={styles.featureDescription}>Manage client information and contacts</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Inventory')}>
          <View style={styles.cardHeader}>
            <Package size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Inventory</Text>
              <Text style={styles.featureDescription}>Manage products and stock levels</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Calendar')}>
          <View style={styles.cardHeader}>
            <Calendar size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Calendar</Text>
              <Text style={styles.featureDescription}>Schedule appointments and tasks</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('CreateInvoice')}>
          <View style={styles.cardHeader}>
            <CircleDollarSign size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Create Invoice</Text>
              <Text style={styles.featureDescription}>Generate new invoices for clients</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('InvoiceList')}>
          <View style={styles.cardHeader}>
            <DollarSign size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Invoice List</Text>
              <Text style={styles.featureDescription}>View and manage all invoices</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('CreateProposal')}>
          <View style={styles.cardHeader}>
            <Send size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Create Proposal</Text>
              <Text style={styles.featureDescription}>Create proposals for new projects</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ProposalList')}>
          <View style={styles.cardHeader}>
            <SendHorizontal size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Proposal List</Text>
              <Text style={styles.featureDescription}>View and track all proposals</Text>
            </View>
          </View>
        </TouchableOpacity>
                <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Technician')}>
          <View style={styles.cardHeader}>
            <IdCard size={32} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Technician</Text>
              <Text style={styles.featureDescription}>Manage technician information</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});
