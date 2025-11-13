import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * UserDashboard Component
 * Dashboard for regular users
 */
export default function UserDashboard({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Features</Text>
        <Text style={styles.info}>
          This is the user dashboard. User features will be implemented here.
        </Text>
        
        {/* Placeholder for user features */}
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>My Orders</Text>
          <Text style={styles.featureDescription}>Coming soon...</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>My Profile</Text>
          <Text style={styles.featureDescription}>Coming soon...</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Support</Text>
          <Text style={styles.featureDescription}>Coming soon...</Text>
        </View>
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
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});
