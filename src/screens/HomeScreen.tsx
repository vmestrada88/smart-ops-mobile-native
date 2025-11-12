import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

/**
 * HomeScreen Component
 * 
 * Main home screen component for the SmartOps application.
 * Displays information about intelligent security and low-voltage solutions.
 */
export default function HomeScreen({ navigation }: any) {
  const { user, logout, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Info Header */}
      {user ? (
        <View style={styles.userHeader}>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.guestHeader}>
          <Text style={styles.guestText}>👋 Guest Mode</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')} 
            style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.heroSection}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Smart Solution for Living LLC</Text>
        <Text style={styles.description}>
          We provide reliable, intelligent low-voltage and smart security solutions for modern homes and businesses.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => console.log('Contact pressed')}
          >
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.productsButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.productsButtonText}>View Products</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.servicesSection}>
        <Text style={styles.servicesTitle}>Our Services</Text>
        <View style={styles.serviceCard}>
          <Text style={styles.serviceIcon}>🔒</Text>
          <Text style={styles.serviceName}>Security Systems</Text>
          <Text style={styles.serviceDescription}>
            Advanced security solutions for your peace of mind
          </Text>
        </View>
        <View style={styles.serviceCard}>
          <Text style={styles.serviceIcon}>📱</Text>
          <Text style={styles.serviceName}>Smart Home</Text>
          <Text style={styles.serviceDescription}>
            Intelligent automation for modern living
          </Text>
        </View>
        <View style={styles.serviceCard}>
          <Text style={styles.serviceIcon}>📡</Text>
          <Text style={styles.serviceName}>Low Voltage</Text>
          <Text style={styles.serviceDescription}>
            Professional installation and maintenance
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  guestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff7ed',
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },
  guestText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9a3412',
  },
  loginLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#14b8a6',
    borderRadius: 6,
  },
  loginLinkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 350,
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
  },
  contactButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
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
  contactButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  productsButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#14b8a6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productsButtonText: {
    color: '#14b8a6',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  servicesSection: {
    padding: 20,
    paddingTop: 40,
  },
  servicesTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  serviceIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
