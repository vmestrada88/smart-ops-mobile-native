import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { getProducts, Product } from '../services/productService';
import { ChevronDown } from 'lucide-react-native';

/**
 * ProductsScreen Component
 * 
 * Displays a list of products from the Smart Ops API
 */
export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  /**
   * Load products from API
   */
  const loadProducts = async () => {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Get unique categories from products
   */
  const categories = useMemo(() => {
    const cats = products
      .map(p => p.category)
      .filter((cat): cat is string => !!cat);
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);

  /**
   * Filter products based on selected filters
   */
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    return filtered;
  }, [products, selectedCategory]);

  /**
   * Render individual product item
   */
  const renderProduct = ({ item }: { item: Product }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        activeOpacity={0.7}
      >
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.brand && (
            <Text style={styles.productBrand}>{item.brand}</Text>
          )}
          {item.model && (
            <Text style={styles.productModel}>Model: {item.model}</Text>
          )}
          {item.priceSell !== undefined && (
            <Text style={styles.productPrice}>
              ${item.priceSell.toFixed(2)}
            </Text>
          )}
          
          {/* Descripción expandible */}
          {isExpanded && item.description && (
            <Text style={styles.productDescription}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <Text style={styles.headerSubtitle}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {/* Filtro por categoría */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.filterChipsContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  selectedCategory === cat && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === cat && styles.filterChipTextActive
                ]}>
                  {cat === 'all' ? 'All' : cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#14b8a6']}
            tintColor="#14b8a6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    color: '#14b8a6',
    fontWeight: '600',
    marginBottom: 2,
  },
  productModel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14b8a6',
    marginTop: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
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
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  // Filtros
  filtersContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterGroup: {
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
