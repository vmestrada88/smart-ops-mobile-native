/**
 * ProtectedFeature Component
 * Shows content only to authenticated users or prompts guest to login
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  guestMessage?: string;
}

export default function ProtectedFeature({ 
  children, 
  guestMessage = 'Please sign in to access this feature' 
}: ProtectedFeatureProps) {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  if (!isAuthenticated) {
    return (
      <View style={styles.guestContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.guestMessage}>{guestMessage}</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  guestContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  guestMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
