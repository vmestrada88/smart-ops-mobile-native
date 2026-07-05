import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { MapPin, Package } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProtectedFeature from '../components/ProtectedFeature';
import BackButton from '../components/BackButton';
import { useAuth } from '../hooks/useAuth';
import { fetchCart, CartItem } from '../services/cartService';
import { createOrder } from '../services/ordersService';

function getLinePrice(item: CartItem) {
  return item.product?.priceSell ?? item.product?.price ?? 0;
}

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + getLinePrice(item) * item.quantity, 0);
  }, [cart]);

  const loadCart = async () => {
    if (!token) return;
    try {
      setCartError(null);
      const data = await fetchCart(token);
      setCart(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error loading cart:', e);
      setCartError('Failed to load cart');
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlePlaceOrder = async () => {
    if (!token) return;

    const requiredFields: Array<keyof typeof shippingAddress> = [
      'name',
      'email',
      'address',
      'city',
      'state',
      'zipCode',
    ];

    for (const f of requiredFields) {
      if (!shippingAddress[f]) {
        Alert.alert('Missing info', 'Please fill all required fields');
        return;
      }
    }

    if (cart.length === 0) {
      Alert.alert('Cart empty', 'Please add items to cart first');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: getLinePrice(item),
      }));

      await createOrder(shippingAddress, items, token);

      Alert.alert('Success', 'Order placed. Payment is arranged outside the app.');
      navigation.navigate('Orders');
    } catch (e: any) {
      console.error('Checkout error:', e);
      Alert.alert('Order error', e?.message || 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  const CheckoutUI = () => (
    <View style={styles.container}>
      <BackButton textColor="#14b8a6" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MapPin size={28} color="#14b8a6" />
          </View>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Shipping & order</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>

          <TextInput
            style={styles.input}
            value={shippingAddress.name}
            onChangeText={(t) => setShippingAddress((s) => ({ ...s, name: t }))}
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            value={shippingAddress.email}
            onChangeText={(t) => setShippingAddress((s) => ({ ...s, email: t }))}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            value={shippingAddress.address}
            onChangeText={(t) => setShippingAddress((s) => ({ ...s, address: t }))}
            placeholder="Address"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />

          <View style={styles.row2}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={shippingAddress.city}
              onChangeText={(t) => setShippingAddress((s) => ({ ...s, city: t }))}
              placeholder="City"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={shippingAddress.state}
              onChangeText={(t) => setShippingAddress((s) => ({ ...s, state: t }))}
              placeholder="State"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
          </View>

          <TextInput
            style={styles.input}
            value={shippingAddress.zipCode}
            onChangeText={(t) => setShippingAddress((s) => ({ ...s, zipCode: t }))}
            placeholder="ZIP Code"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading || cartLoading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View style={styles.primaryRow}>
                <Package size={18} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Place order</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {cartLoading ? (
            <View style={styles.summaryLoading}>
              <ActivityIndicator size="small" color="#14b8a6" />
              <Text style={styles.summaryLoadingText}>Loading items...</Text>
            </View>
          ) : cartError ? (
            <Text style={styles.errorText}>{cartError}</Text>
          ) : (
            <>
              {cart.map((item) => (
                <View key={item.id} style={styles.summaryItem}>
                  <View style={styles.summaryItemLeft}>
                    {item.product?.image_url ? (
                      <Image source={{ uri: item.product.image_url }} style={styles.summaryItemImage} />
                    ) : (
                      <View style={[styles.summaryItemImage, styles.summaryItemImagePlaceholder]} />
                    )}
                  </View>
                  <View style={styles.summaryItemMiddle}>
                    <Text style={styles.summaryItemName} numberOfLines={1}>
                      {item.product?.name ?? 'Unknown'}
                    </Text>
                    <Text style={styles.summaryItemMeta}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.summaryItemPrice}>
                    ${(getLinePrice(item) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}

              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>${totalAmount.toFixed(2)}</Text>
              </View>
            </>
          )}
        </View>

        <Text style={styles.noteText}>
          Card payments are not processed in this app. Retail purchases use the Amazon Associates storefront on
          the web.
        </Text>
      </ScrollView>
    </View>
  );

  return (
    <ProtectedFeature guestMessage="Please sign in to checkout">
      <CheckoutUI />
    </ProtectedFeature>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 28 },
  header: { marginTop: 10, marginBottom: 14, alignItems: 'center', gap: 6 },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#1f2937' },
  subtitle: { fontSize: 14, color: '#6b7280' },
  section: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    marginBottom: 10,
  },
  row2: { flexDirection: 'row', gap: 10 },
  inputHalf: { flex: 1 },
  primaryButton: {
    marginTop: 10,
    backgroundColor: '#14b8a6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: { backgroundColor: '#93c5bd' },
  primaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  summaryLoading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryLoadingText: { color: '#6b7280' },
  errorText: { color: '#ef4444', fontSize: 14 },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  summaryItemLeft: {},
  summaryItemImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  summaryItemImagePlaceholder: { backgroundColor: '#f3f4f6' },
  summaryItemMiddle: { flex: 1, gap: 2 },
  summaryItemName: { fontSize: 14, fontWeight: '800', color: '#1f2937' },
  summaryItemMeta: { fontSize: 12, color: '#6b7280' },
  summaryItemPrice: { fontSize: 14, fontWeight: '900', color: '#14b8a6' },
  summaryDivider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 16, fontWeight: '800', color: '#1f2937' },
  summaryTotalValue: { fontSize: 16, fontWeight: '900', color: '#14b8a6' },
  noteText: { marginTop: 10, fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
});

