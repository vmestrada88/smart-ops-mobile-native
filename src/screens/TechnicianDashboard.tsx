import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShoppingCart, Package, ClipboardList } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function TechnicianDashboard() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Technician Dashboard</Text>
        <Text style={styles.info}>
          You can manage shop orders and view your order history.
        </Text>

        <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('Products')}>
          <View style={styles.cardHeader}>
            <ShoppingCart size={30} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Shop / Products</Text>
              <Text style={styles.featureDescription}>Browse products and add them to cart</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cardHeader}>
            <Package size={30} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Cart</Text>
              <Text style={styles.featureDescription}>Review cart items and checkout</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('Orders')}>
          <View style={styles.cardHeader}>
            <ClipboardList size={30} color="#14b8a6" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.featureTitle}>Orders</Text>
              <Text style={styles.featureDescription}>View your order history</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Jobs / Calendar</Text>
          <Text style={styles.featureDescription}>Coming soon (port of tasks calendar)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  info: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cardTextContainer: { flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  featureDescription: { fontSize: 14, color: '#6b7280' },
});

