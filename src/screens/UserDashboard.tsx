import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';

/**
 * UserDashboard Component
 * Dashboard for regular users
 */
export default function UserDashboard({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Dashboard</Text>
        <Text style={styles.welcome}>Welcome, {user?.name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#3b82f6',
    fontWeight: '600',
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
