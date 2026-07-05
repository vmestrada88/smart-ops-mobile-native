import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Package, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ProtectedFeature from '../components/ProtectedFeature';
import BackButton from '../components/BackButton';
import { useAuth } from '../hooks/useAuth';
import { fetchOrders, Order } from '../services/ordersService';

function formatStatus(status?: string) {
  if (!status) return 'unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusBadgeStyle(status?: string) {
  switch (status) {
    case 'pending':
      return styles.badgePending;
    case 'paid':
      return styles.badgePaid;
    case 'shipped':
      return styles.badgeShipped;
    case 'delivered':
      return styles.badgeDelivered;
    case 'cancelled':
      return styles.badgeCancelled;
    default:
      return styles.badgeDefault;
  }
}

function StatusIcon({ status }: { status?: string }) {
  switch (status) {
    case 'pending':
      return <Clock size={18} color="#f59e0b" />;
    case 'paid':
      return <CheckCircle size={18} color="#3b82f6" />;
    case 'shipped':
      return <Truck size={18} color="#f97316" />;
    case 'delivered':
      return <CheckCircle size={18} color="#22c55e" />;
    case 'cancelled':
      return <XCircle size={18} color="#ef4444" />;
    default:
      return <Clock size={18} color="#6b7280" />;
  }
}

export default function OrdersScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const loadOrders = async () => {
    if (!token) return;
    try {
      setError(null);
      const data = await fetchOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error loading orders:', e);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const OrdersUI = () => {
    const totalOrders = orders.length;

    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#14b8a6" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <BackButton textColor="#14b8a6" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Package size={40} color="#14b8a6" />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>My Orders</Text>
              <Text style={styles.subtitle}>{totalOrders} order(s)</Text>
            </View>
          </View>

          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Package size={60} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyText}>Your order history will appear here</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Products')}>
                <Text style={styles.primaryButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderTopRow}>
                      <View style={styles.statusRow}>
                        <StatusIcon status={order.status} />
                        <View>
                          <Text style={styles.orderMeta}>Order #{order.id}</Text>
                          <Text style={styles.orderDate}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.rightRow}>
                        <View style={[styles.badge, getStatusBadgeStyle(order.status)]}>
                          <Text style={styles.badgeText}>{formatStatus(order.status)}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        >
                          <Eye size={18} color="#14b8a6" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.orderSummaryRow}>
                      <View>
                        <Text style={styles.orderTotal}>
                          Total: ${Number(order.totalAmount || 0).toFixed(2)}
                        </Text>
                        <Text style={styles.orderItemsCount}>
                          {order.orderItems?.length || 0} item(s)
                        </Text>
                      </View>
                    </View>

                    {isExpanded && order.orderItems && order.orderItems.length > 0 ? (
                      <View style={styles.itemsBlock}>
                        {order.orderItems.map((it) => (
                          <View key={it.id} style={styles.itemRow}>
                            <View style={styles.itemImageWrap}>
                              {it.product?.image_url ? (
                                <Image source={{ uri: it.product.image_url }} style={styles.itemImage} />
                              ) : (
                                <View style={[styles.itemImage, styles.itemImagePlaceholder]} />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.itemName} numberOfLines={1}>
                                {it.product?.name ?? 'Unknown'}
                              </Text>
                              <Text style={styles.itemMeta}>Qty: {it.quantity}</Text>
                            </View>
                            <Text style={styles.itemLineTotal}>
                              ${(Number(it.price || 0) * it.quantity).toFixed(2)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ProtectedFeature guestMessage="Please sign in to view your orders">
      <OrdersUI />
    </ProtectedFeature>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 28 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#6b7280' },
  errorText: { fontSize: 16, color: '#ef4444', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#14b8a6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  header: {
    marginTop: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#1f2937' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  emptyContainer: { alignItems: 'center', paddingTop: 30, paddingBottom: 40, gap: 10 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1f2937', textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  primaryButton: { marginTop: 10, backgroundColor: '#14b8a6', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 18 },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderMeta: { fontSize: 14, fontWeight: '800', color: '#1f2937' },
  orderDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: '#1f2937', fontWeight: '900', fontSize: 12 },
  badgePending: { backgroundColor: '#fef3c7' },
  badgePaid: { backgroundColor: '#dbeafe' },
  badgeShipped: { backgroundColor: '#fed7aa' },
  badgeDelivered: { backgroundColor: '#dcfce7' },
  badgeCancelled: { backgroundColor: '#fee2e2' },
  badgeDefault: { backgroundColor: '#e5e7eb' },
  eyeButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#ecfeff', alignItems: 'center', justifyContent: 'center' },
  orderSummaryRow: { marginTop: 10 },
  orderTotal: { fontSize: 16, fontWeight: '900', color: '#1f2937' },
  orderItemsCount: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  itemsBlock: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', gap: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemImageWrap: { width: 44, height: 44 },
  itemImage: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#e5e7eb' },
  itemImagePlaceholder: { backgroundColor: '#f3f4f6' },
  itemName: { fontSize: 13, fontWeight: '900', color: '#1f2937' },
  itemMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  itemLineTotal: { fontSize: 13, fontWeight: '900', color: '#14b8a6' },
});

