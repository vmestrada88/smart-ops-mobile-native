import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Home, LogOut } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  showHomeButton?: boolean;
  showLogoutButton?: boolean;
}

export default function CustomHeader({ 
  title, 
  backgroundColor = '#14b8a6',
  textColor = '#ffffff',
  showHomeButton = true,
  showLogoutButton = true
}: CustomHeaderProps) {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  const handleGoHome = () => {
    // Navigate to appropriate dashboard based on user role
    if (user?.role === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
      navigation.navigate('UserDashboard');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Logo and Title in same row */}
        <View style={styles.topRow}>
          <Image 
            source={require('../assets/images/logo.jpg')} 
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>
        
        {user && (
          <Text style={[styles.welcome, { color: textColor }]}>
            Welcome, {user.name}
          </Text>
        )}
        
        {(showHomeButton || showLogoutButton) && (
          <View style={styles.buttonContainer}>
            {showHomeButton && (
              <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                <Home size={18} color={backgroundColor} />
                <Text style={[styles.homeText, { color: backgroundColor }]}>Home</Text>
              </TouchableOpacity>
            )}
            {showLogoutButton && (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={18} color={backgroundColor} />
                <Text style={[styles.logoutText, { color: backgroundColor }]}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
  },
  welcome: {
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
