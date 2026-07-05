import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProtectedFeature from '../components/ProtectedFeature';
import BackButton from '../components/BackButton';
import { useAuth } from '../hooks/useAuth';
import { fetchCart, CartItem, removeCartItem, updateCartItem } from '../services/cartService';

function getLinePrice(item: CartItem) {
  return item.product?.priceSell ?? item.product?.price ?? 0;
}

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + getLinePrice(item) * item.quantity, 0);
  }, [cart]);

  const loadCart = async () => {
    if (!token) return;
    try {
      setError(null);
      const data = await fetchCart(token);
      setCart(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error loading cart:', e);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCart();
  };

  const handleUpdateQuantity = async (item: CartItem, nextQuantity: number) => {
    if (!token) return;
    if (nextQuantity < 1) return;

    try {
      await updateCartItem(item.id, nextQuantity, token);
      await loadCart();
    } catch (e) {
      console.error('Error updating cart quantity:', e);
      Alert.alert('Error', 'Error updating quantity');
    }
  };

  const handleRemove = async (item: CartItem) => {
    if (!token) return;
    try {
      await removeCartItem(item.id, token);
      await loadCart();
      Alert.alert('Removed', 'Item removed from cart');
    } catch (e) {
      console.error('Error removing cart item:', e);
      Alert.alert('Error', 'Error removing item');
    }
  };

  const CartUI = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#14b8a6" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCart}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View style={styles.container}>
        <BackButton textColor="#14b8a6" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#14b8a6']} />}
        >
          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingCart size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>Add products to get started</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Products')}
              >
                <ArrowRight size={18} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.listHeader}>
                <Text style={styles.title}>Shopping Cart</Text>
                <Text style={styles.subtitle}>{itemCount} items</Text>
              </View>

              <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.itemCard}>
                    <View style={styles.itemLeft}>
                      {item.product?.image_url ? (
                        <Image source={{ uri: item.product.image_url }} style={styles.itemImage} />
                      ) : (
                        <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                          <ShoppingCart size={18} color="#14b8a6" />
                        </View>
                      )}
                    </View>

                    <View style={styles.itemMiddle}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.product?.name ?? 'Unknown product'}
                      </Text>
                      <Text style={styles.itemMeta}>
                        ${getLinePrice(item).toFixed(2)} x {item.quantity}
                      </Text>
                      <Text style={styles.itemLineTotal}>
                        ${(getLinePrice(item) * item.quantity).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.itemRight}>
                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={[styles.qtyButton, item.quantity <= 1 && styles.qtyButtonDisabled]}
                          disabled={item.quantity <= 1}
                          onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
                        >
                          <Minus size={18} color={item.quantity <= 1 ? '#9ca3af' : '#14b8a6'} />
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
                        >
                          <Plus size={18} color="#14b8a6" />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item)}>
                        <Trash2 size={18} color="#ef4444" />
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                scrollEnabled={false}
              />

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal ({cart.length} items)</Text>
                  <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryValue}>Calculated at checkout</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryTotalRow}>
                  <Text style={styles.summaryTotalLabel}>Total</Text>
                  <Text style={styles.summaryTotalValue}>${totalAmount.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('Checkout')}
                >
                  <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Products')}
                >
                  <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ProtectedFeature guestMessage="Please sign in to access your cart">
      <CartUI />
    </ProtectedFeature>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  listHeader: {
    marginTop: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  itemLeft: {},
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  itemImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemMiddle: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  itemMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  itemLineTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#14b8a6',
    marginTop: 2,
  },
  itemRight: {
    gap: 10,
    alignItems: 'flex-end',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonDisabled: {
    backgroundColor: '#f9fafb',
  },
  qtyText: {
    minWidth: 18,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#fff1f2',
  },
  removeText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },
  summaryCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#14b8a6',
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: '#14b8a6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '700',
  },
});

