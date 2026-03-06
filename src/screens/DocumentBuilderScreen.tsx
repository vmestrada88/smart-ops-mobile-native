import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BackButton from '../components/BackButton';
import { Client, createClient, getClients } from '../services/clientService';
import { Product, createProduct, getProducts } from '../services/productService';
import { createInvoice, createProposal } from '../services/invoiceService';
import { useAuth } from '../hooks/useAuth';
import { generatePDF } from 'react-native-html-to-pdf';
import RNShare from 'react-native-share';

type DocumentType = 'invoice' | 'proposal';

interface SelectedItem {
  product: Product;
  quantity: number;
}

interface ExtraCost {
  name: string;
  cost: number;
}

interface DiscountItem {
  name: string;
  dCost: number;
}

interface Props {
  documentType: DocumentType;
}

const TAX_RATE = 0.07;

export default function DocumentBuilderScreen({ documentType }: Props) {
  const { token } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);

  const [showCreateClient, setShowCreateClient] = useState(false);
  const [newClient, setNewClient] = useState({
    companyName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    priceBuy: '',
    priceSell: '',
    quantity: '1',
  });

  const [productSearch, setProductSearch] = useState('');

  const [laborHoursInput, setLaborHoursInput] = useState('0');
  const [hourlyRateInput, setHourlyRateInput] = useState('100');
  const [appliedLabor, setAppliedLabor] = useState({ hours: 0, rate: 100 });

  const [taxExempt, setTaxExempt] = useState(false);
  const [notes, setNotes] = useState('');
  const [extraCosts, setExtraCosts] = useState<ExtraCost[]>([]);
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [extraName, setExtraName] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [discountName, setDiscountName] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const loadInitialData = async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        getClients(token || undefined),
        getProducts(),
      ]);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load clients/products');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const filteredClients = useMemo(() => {
    const query = clientSearch.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      (client.companyName || '').toLowerCase().includes(query)
    );
  }, [clientSearch, clients]);

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.brand || ''} ${product.model || ''} ${product.category || ''}`
        .toLowerCase()
        .includes(query)
    );
  }, [productSearch, products]);

  const parseNonNegative = (value: string, fallback = 0) => {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed) || parsed < 0) return fallback;
    return parsed;
  };

  const getProductSellPrice = (item: Product) => Number(item.priceSell ?? item.price ?? 0);

  const getLaborCostByCategory = (category?: string) => {
    switch (category) {
      case 'IP Camera':
        return 120;
      case 'Analog Camera':
        return 70;
      case 'NVR':
        return 60;
      case 'DVR':
        return 90;
      case 'Hard Drive':
        return 0;
      case 'Camera By Client':
        return 120;
      case 'Recorder By Client':
        return 120;
      default:
        return 0;
    }
  };

  const addProductToDocument = (product: Product) => {
    setSelectedItems((prev) => {
      const idx = prev.findIndex((entry) => entry.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems((prev) => prev.filter((entry) => entry.product.id !== productId));
      return;
    }

    setSelectedItems((prev) =>
      prev.map((entry) =>
        entry.product.id === productId ? { ...entry, quantity } : entry
      )
    );
  };

  const applyLabor = () => {
    const hours = parseNonNegative(laborHoursInput, 0);
    const rate = parseNonNegative(hourlyRateInput, 0);
    setAppliedLabor({ hours, rate });
    setLaborHoursInput(String(hours));
    setHourlyRateInput(String(rate));
  };

  const clearLabor = () => {
    const rate = parseNonNegative(hourlyRateInput, 0);
    setAppliedLabor({ hours: 0, rate });
    setLaborHoursInput('0');
    setHourlyRateInput(String(rate));
  };

  const subtotalProducts = selectedItems.reduce(
    (sum, entry) => {
      const unit = getProductSellPrice(entry.product);
      const labor = getLaborCostByCategory(entry.product.category);
      return sum + (unit + labor) * entry.quantity;
    },
    0
  );
  const totalLabor = appliedLabor.hours * appliedLabor.rate;
  const totalExtras = extraCosts.reduce((acc, cur) => acc + cur.cost, 0);
  const totalDiscount = discounts.reduce((acc, cur) => acc + cur.dCost, 0);
  const subtotal = subtotalProducts + totalLabor + totalExtras - totalDiscount;
  const tax = taxExempt ? 0 : subtotal * TAX_RATE;
  const total = subtotal + tax;

  const addExtraCost = () => {
    const parsed = parseNonNegative(extraAmount, -1);
    if (!extraName.trim() || parsed < 0) return;
    setExtraCosts((prev) => [...prev, { name: extraName.trim(), cost: parsed }]);
    setExtraName('');
    setExtraAmount('');
  };

  const addDiscount = () => {
    const parsed = parseNonNegative(discountAmount, -1);
    if (!discountName.trim() || parsed < 0) return;
    setDiscounts((prev) => [...prev, { name: discountName.trim(), dCost: parsed }]);
    setDiscountName('');
    setDiscountAmount('');
  };

  const handleCreateClient = async () => {
    if (!newClient.companyName || !newClient.address || !newClient.city || !newClient.state || !newClient.zip) {
      Alert.alert('Missing fields', 'Please complete all client fields');
      return;
    }

    try {
      const created = await createClient(
        {
          ...newClient,
          status: 'active',
          contacts: [],
        },
        token || undefined
      );

      setClients((prev) => [created, ...prev]);
      setSelectedClient(created);
      setClientSearch(created.companyName || '');
      setShowCreateClient(false);
      setNewClient({ companyName: '', address: '', city: '', state: '', zip: '' });
    } catch {
      Alert.alert('Error', 'Unable to create client');
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.priceBuy || !newProduct.priceSell || !newProduct.quantity) {
      Alert.alert('Missing fields', 'Name, buy/sell price and quantity are required');
      return;
    }

    try {
      const created = await createProduct(
        {
          name: newProduct.name,
          description: newProduct.description || '',
          category: newProduct.category || '',
          brand: newProduct.brand || '',
          model: newProduct.model || '',
          priceBuy: parseNonNegative(newProduct.priceBuy, 0),
          priceSell: parseNonNegative(newProduct.priceSell, 0),
          quantity: parseNonNegative(newProduct.quantity, 0),
        },
        token || undefined
      );

      setProducts((prev) => [created, ...prev]);
      addProductToDocument(created);
      setShowCreateProduct(false);
      setNewProduct({
        name: '',
        category: '',
        brand: '',
        model: '',
        description: '',
        priceBuy: '',
        priceSell: '',
        quantity: '1',
      });
    } catch {
      Alert.alert('Error', 'Unable to create product');
    }
  };

  const handleSave = async () => {
    if (!selectedClient?.id) {
      Alert.alert('Validation', 'Please select a client');
      return;
    }

    if (!selectedItems.length) {
      Alert.alert('Validation', 'Please add at least one product');
      return;
    }

      const items = selectedItems.map((entry) => {
      const unitPrice = getProductSellPrice(entry.product);
        const laborCost = getLaborCostByCategory(entry.product.category);
      const quantity = entry.quantity;
        const subtotalLine = (unitPrice + laborCost) * quantity;

      return {
        productId: entry.product.id,
        name: entry.product.name,
        quantity,
        unitPrice,
          laborCost,
        subtotal: subtotalLine,
          price: unitPrice + laborCost,
        total: subtotalLine,
        description: entry.product.description || '',
      };
    });

    setSaving(true);

    try {
      if (documentType === 'proposal') {
        const summaryBlock = [
          `Subtotal: $${subtotal.toFixed(2)}`,
          `Tax: $${tax.toFixed(2)}${taxExempt ? ' (Tax Exempt)' : ''}`,
          `Total: $${total.toFixed(2)}`,
        ].join('\n');

        const normalizedNotes = [notes?.trim(), summaryBlock].filter(Boolean).join('\n\n');

        await createProposal(
          {
            clientId: Number(selectedClient.id),
            clientInfoName: selectedClient.companyName || 'Client',
            clientInfoAddress: selectedClient.address || '',
            tax,
            notes: normalizedNotes,
            items,
          },
          token || undefined
        );
        Alert.alert('Success', 'Proposal saved successfully');
      } else {
        await createInvoice(
          {
            clientId: Number(selectedClient.id),
            date: new Date().toISOString(),
            laborHours: appliedLabor.hours,
            laborRate: appliedLabor.rate,
            taxRate: TAX_RATE,
            taxExempt,
            totalAmount: total,
            items,
          },
          token || undefined
        );
        Alert.alert('Success', 'Invoice saved successfully');
      }
    } catch (error: any) {
      console.error('❌ Save error:', error);
      Alert.alert('Error', error?.message || 'Unable to save document');
    } finally {
      setSaving(false);
    }
  };

  const buildPdfHtml = () => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const clientName = selectedClient?.companyName || 'Not selected';
    const clientAddress = selectedClient?.address || '';
    const clientCity = selectedClient?.city || '';
    const clientState = selectedClient?.state || '';
    const clientZip = selectedClient?.zip || '';

    const productRows = selectedItems
      .map((entry) => {
        const price = getProductSellPrice(entry.product);
        const catLabor = getLaborCostByCategory(entry.product.category);
        const lineTotal = (price + catLabor) * entry.quantity;
        return `<tr>
          <td>${entry.product.name}</td>
          <td style="text-align:center">${entry.quantity}</td>
          <td style="text-align:right">$${price.toFixed(2)}</td>
          <td style="text-align:right">$${catLabor.toFixed(2)}</td>
          <td style="text-align:right">$${lineTotal.toFixed(2)}</td>
        </tr>`;
      })
      .join('');

    const totalQty = selectedItems.reduce((s, e) => s + e.quantity, 0);
    const totalPrice = selectedItems.reduce((s, e) => s + getProductSellPrice(e.product) * e.quantity, 0);
    const totalCatLabor = selectedItems.reduce((s, e) => s + getLaborCostByCategory(e.product.category) * e.quantity, 0);
    const totalLineProducts = selectedItems.reduce((s, e) => s + (getProductSellPrice(e.product) + getLaborCostByCategory(e.product.category)) * e.quantity, 0);

    const extraRows = extraCosts
      .map((e) => `<tr><td colspan="4">${e.name}</td><td style="text-align:right">$${e.cost.toFixed(2)}</td></tr>`)
      .join('');

    const discountRows = discounts
      .map((d) => `<tr><td colspan="4">${d.name}</td><td style="text-align:right">-$${d.dCost.toFixed(2)}</td></tr>`)
      .join('');

    const laborRow =
      totalLabor > 0
        ? `<p><strong>Manual Labor</strong> (${appliedLabor.hours} hrs x $${appliedLabor.rate.toFixed(2)}): <strong>$${totalLabor.toFixed(2)}</strong></p>`
        : '';

    const notesBlock =
      notes?.trim()
        ? `<h3>Notes</h3><p>${notes.trim().replace(/\n/g, '<br/>')}</p>`
        : '';

    return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"/>
    <style>
      body{font-family:Helvetica,Arial,sans-serif;margin:20px;color:#1f2937;font-size:12px}
      h1{font-size:22px;text-align:right;margin-bottom:4px}
      .header{display:flex;justify-content:space-between}
      .company{font-size:14px;font-weight:bold}
      .sub{font-size:10px;color:#555}
      table{width:100%;border-collapse:collapse;margin-top:10px}
      th,td{border:1px solid #ccc;padding:6px 8px;font-size:11px}
      th{background:#0d9488;color:#fff;font-weight:bold}
      tfoot td{background:#e5e7eb;font-weight:bold}
      .totals{margin-top:12px;text-align:right}
      .totals p{margin:4px 0}
      .warranty{margin-top:20px;font-size:9px;color:#6b7280}
    </style></head><body>
      <h1>${documentType === 'proposal' ? 'PROPOSAL' : 'INVOICE'}</h1>
      <p class="company">Smart Solution for Living LLC</p>
      <p class="sub">Security Systems, Smart Homes & Networking Company</p>
      <p class="sub">Tel: +1 (786) 824-4191 | comercial@smartsolutionfl.com</p>
      <p class="sub">2438 NE 184 St, North Miami Beach, FL 33160</p>
      <hr/>
      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Address:</strong> ${clientAddress}, ${clientCity}, ${clientState} ${clientZip}</p>
      <p><strong>Date:</strong> ${dateStr}</p>

      <table>
        <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Labor</th><th>Total</th></tr></thead>
        <tbody>${productRows}</tbody>
        <tfoot><tr>
          <td>Totals</td>
          <td style="text-align:center">${totalQty}</td>
          <td style="text-align:right">$${totalPrice.toFixed(2)}</td>
          <td style="text-align:right">$${totalCatLabor.toFixed(2)}</td>
          <td style="text-align:right">$${totalLineProducts.toFixed(2)}</td>
        </tr></tfoot>
      </table>

      ${extraRows ? '<h3>Extra Costs</h3><table><tbody>' + extraRows + '</tbody></table>' : ''}
      ${discountRows ? '<h3>Discounts</h3><table><tbody>' + discountRows + '</tbody></table>' : ''}
      ${laborRow}

      <div class="totals">
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        <p><strong>Tax (7%):</strong> ${taxExempt ? '$0.00 (Tax Exempt)' : `$${tax.toFixed(2)}`}</p>
        <p style="font-size:16px"><strong>Total: $${total.toFixed(2)}</strong></p>
      </div>

      ${notesBlock}

      <div class="warranty">
        <p>Important: The full payment for the equipment must be made before the installation work is scheduled. All work will be performed by a qualified professional.</p>
        <p>Warranty Disclaimer: The installed equipment is covered by a limited warranty for a period of one (1) year from the date of installation. Labor is warranted for six (6) months. No warranty is provided for any equipment not supplied directly by our company.</p>
      </div>
    </body></html>`;
  };

  const handleExportPDF = async () => {
    try {
      const html = buildPdfHtml();
      const dateTag = new Date().toISOString().slice(0, 10);
      const clientTag = (selectedClient?.companyName || 'client').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${documentType}-${dateTag}-${clientTag}`;

      const options = {
        html,
        fileName,
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
      };

      const file = await generatePDF(options);

      if (!file.filePath) {
        Alert.alert('Error', 'PDF generation failed');
        return;
      }

      await RNShare.open({
        url: Platform.OS === 'android' ? `file://${file.filePath}` : file.filePath,
        type: 'application/pdf',
        title: `Share ${documentType}`,
      });
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        Alert.alert('Error', error?.message || 'Unable to generate PDF');
      }
    }
  };

  return (
    <View style={styles.container}>
      <BackButton textColor="#14b8a6" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{documentType === 'proposal' ? 'Create Proposal' : 'Create Invoice'}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <TextInput
            value={clientSearch}
            onChangeText={(text) => {
              setClientSearch(text);
              setShowClientSuggestions(true);
              if (!text) setSelectedClient(null);
            }}
            onFocus={() => setShowClientSuggestions(true)}
            placeholder="Type client name"
            style={styles.input}
          />

          {showClientSuggestions && (
            <View style={styles.suggestions}>
              <TouchableOpacity
                style={[styles.suggestionItem, styles.addNewItem]}
                onPress={() => {
                  setShowCreateClient(true);
                  setShowClientSuggestions(false);
                }}
              >
                <Text style={styles.addNewText}>+ Add new client</Text>
              </TouchableOpacity>

              {filteredClients.slice(0, 8).map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSelectedClient(client);
                    setClientSearch(client.companyName || '');
                    setShowClientSuggestions(false);
                  }}
                >
                  <Text>{client.companyName || `Client #${client.id}`}</Text>
                </TouchableOpacity>
              ))}

              {filteredClients.length === 0 && (
                <Text style={styles.emptySuggestion}>No clients found</Text>
              )}
            </View>
          )}

          {selectedClient && (
            <Text style={styles.selectedTag}>Selected: {selectedClient.companyName}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          <TextInput
            value={productSearch}
            onChangeText={setProductSearch}
            placeholder="Search products"
            style={styles.input}
          />

          {filteredProducts.slice(0, 10).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productItem}
              onPress={() => addProductToDocument(product)}
            >
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${getProductSellPrice(product).toFixed(2)}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowCreateProduct((prev) => !prev)}
          >
            <Text style={styles.secondaryButtonText}>
              {showCreateProduct ? 'Close New Product' : 'Add New Product'}
            </Text>
          </TouchableOpacity>

          {showCreateProduct && (
            <View style={styles.inlineForm}>
              <TextInput placeholder="Name *" value={newProduct.name} onChangeText={(text) => setNewProduct({ ...newProduct, name: text })} style={styles.input} />
              <TextInput placeholder="Category" value={newProduct.category} onChangeText={(text) => setNewProduct({ ...newProduct, category: text })} style={styles.input} />
              <TextInput placeholder="Brand" value={newProduct.brand} onChangeText={(text) => setNewProduct({ ...newProduct, brand: text })} style={styles.input} />
              <TextInput placeholder="Model" value={newProduct.model} onChangeText={(text) => setNewProduct({ ...newProduct, model: text })} style={styles.input} />
              <TextInput placeholder="Buy Price *" keyboardType="decimal-pad" value={newProduct.priceBuy} onChangeText={(text) => setNewProduct({ ...newProduct, priceBuy: text })} style={styles.input} />
              <TextInput placeholder="Sell Price *" keyboardType="decimal-pad" value={newProduct.priceSell} onChangeText={(text) => setNewProduct({ ...newProduct, priceSell: text })} style={styles.input} />
              <TextInput placeholder="Quantity *" keyboardType="numeric" value={newProduct.quantity} onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })} style={styles.input} />
              <TextInput placeholder="Description" value={newProduct.description} onChangeText={(text) => setNewProduct({ ...newProduct, description: text })} style={styles.input} />

              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateProduct}>
                <Text style={styles.primaryButtonText}>Insert Product</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Products</Text>
          {selectedItems.length === 0 && <Text style={styles.muted}>No products selected</Text>}
          {selectedItems.map((entry) => {
            const price = getProductSellPrice(entry.product);
            const laborByCategory = getLaborCostByCategory(entry.product.category);
            const lineTotal = (price + laborByCategory) * entry.quantity;
            return (
              <View key={entry.product.id} style={styles.selectedItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{entry.product.name}</Text>
                  <Text style={styles.muted}>
                    ${price.toFixed(2)} + labor ${laborByCategory.toFixed(2)} x {entry.quantity} = ${lineTotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.qtyActions}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateProductQuantity(entry.product.id, entry.quantity - 1)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateProductQuantity(entry.product.id, entry.quantity + 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => updateProductQuantity(entry.product.id, 0)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extra Costs</Text>
          <View style={styles.inlineRow}>
            <TextInput placeholder="Description" value={extraName} onChangeText={setExtraName} style={[styles.input, styles.halfInput]} />
            <TextInput placeholder="Cost" keyboardType="decimal-pad" value={extraAmount} onChangeText={setExtraAmount} style={[styles.input, styles.halfInput]} />
          </View>
          <TouchableOpacity style={styles.primaryButtonSmall} onPress={addExtraCost}>
            <Text style={styles.primaryButtonText}>+ Add Extra</Text>
          </TouchableOpacity>
          {extraCosts.map((extra, idx) => (
            <View key={`${extra.name}-${idx}`} style={styles.lineRow}>
              <Text style={styles.muted}>{extra.name}</Text>
              <View style={styles.lineRight}>
                <Text style={styles.muted}>${extra.cost.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => setExtraCosts((prev) => prev.filter((_, i) => i !== idx))}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discounts</Text>
          <View style={styles.inlineRow}>
            <TextInput placeholder="Description" value={discountName} onChangeText={setDiscountName} style={[styles.input, styles.halfInput]} />
            <TextInput placeholder="Amount" keyboardType="decimal-pad" value={discountAmount} onChangeText={setDiscountAmount} style={[styles.input, styles.halfInput]} />
          </View>
          <TouchableOpacity style={styles.primaryButtonSmall} onPress={addDiscount}>
            <Text style={styles.primaryButtonText}>+ Add Discount</Text>
          </TouchableOpacity>
          {discounts.map((d, idx) => (
            <View key={`${d.name}-${idx}`} style={styles.lineRow}>
              <Text style={styles.muted}>{d.name}</Text>
              <View style={styles.lineRight}>
                <Text style={styles.muted}>-${d.dCost.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => setDiscounts((prev) => prev.filter((_, i) => i !== idx))}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labor</Text>
          <TextInput
            value={laborHoursInput}
            onChangeText={setLaborHoursInput}
            onSubmitEditing={applyLabor}
            keyboardType="decimal-pad"
            placeholder="Labor Hours"
            style={styles.input}
          />
          <TextInput
            value={hourlyRateInput}
            onChangeText={setHourlyRateInput}
            onSubmitEditing={applyLabor}
            keyboardType="decimal-pad"
            placeholder="Hourly Rate"
            style={styles.input}
          />
          <View style={styles.rowActions}>
            <TouchableOpacity style={styles.primaryButtonSmall} onPress={applyLabor}>
              <Text style={styles.primaryButtonText}>Insert Labor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButtonSmall} onPress={clearLabor}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {totalLabor > 0 && (
            <View style={styles.laborCard}>
              <Text style={styles.laborLabel}>Manual Labor</Text>
              <View style={styles.laborControls}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setAppliedLabor((prev) => ({ ...prev, hours: Math.max(0, prev.hours - 0.5) }))}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.laborValue}>{appliedLabor.hours}h</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setAppliedLabor((prev) => ({ ...prev, hours: prev.hours + 0.5 }))}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>

                <TextInput
                  value={String(appliedLabor.rate)}
                  onChangeText={(text) => setAppliedLabor((prev) => ({ ...prev, rate: parseNonNegative(text, 0) }))}
                  keyboardType="decimal-pad"
                  style={styles.laborRateInput}
                />

                <TouchableOpacity style={styles.removeBtn} onPress={clearLabor}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.muted}>Applied: ${totalLabor.toFixed(2)}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.sectionTitle}>Tax Exempt</Text>
            <Switch value={taxExempt} onValueChange={setTaxExempt} />
          </View>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            multiline
            style={[styles.input, styles.notesInput]}
          />

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLine}>Subtotal: ${subtotal.toFixed(2)}</Text>
            <Text style={styles.summaryLine}>
              Tax (7%): {taxExempt ? '$0.00 (Tax Exempt)' : `$${tax.toFixed(2)}`}
            </Text>
            <Text style={styles.summaryTotal}>Total: ${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? 'Saving...' : documentType === 'proposal' ? 'Save Proposal' : 'Save Invoice'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleExportPDF}>
            <Text style={styles.secondaryButtonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showCreateClient} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Add New Client</Text>
            <TextInput placeholder="Company Name" value={newClient.companyName} onChangeText={(text) => setNewClient({ ...newClient, companyName: text })} style={styles.input} />
            <TextInput placeholder="Address" value={newClient.address} onChangeText={(text) => setNewClient({ ...newClient, address: text })} style={styles.input} />
            <TextInput placeholder="City" value={newClient.city} onChangeText={(text) => setNewClient({ ...newClient, city: text })} style={styles.input} />
            <TextInput placeholder="State" value={newClient.state} onChangeText={(text) => setNewClient({ ...newClient, state: text })} style={styles.input} />
            <TextInput placeholder="Zip" value={newClient.zip} onChangeText={(text) => setNewClient({ ...newClient, zip: text })} style={styles.input} keyboardType="numeric" />
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.secondaryButtonSmall} onPress={() => setShowCreateClient(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleCreateClient}>
                <Text style={styles.primaryButtonText}>Save Client</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 12 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    color: '#111827',
  },
  notesInput: { minHeight: 90, textAlignVertical: 'top' },
  inlineRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  halfInput: { flex: 1 },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8,
  },
  lineRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  removeText: { color: '#ef4444', fontSize: 16, fontWeight: '700' },
  suggestions: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' },
  suggestionItem: { paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  addNewItem: { backgroundColor: '#f0fdfa' },
  addNewText: { color: '#0f766e', fontWeight: '700' },
  emptySuggestion: { padding: 10, color: '#6b7280' },
  selectedTag: { marginTop: 6, color: '#0f766e', fontWeight: '600' },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productName: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#0f766e' },
  secondaryButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonSmall: {
    borderWidth: 1,
    borderColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#0f766e', fontWeight: '700' },
  inlineForm: { marginTop: 10 },
  selectedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  qtyActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { color: '#fff', fontWeight: '700' },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: '#fff', fontWeight: '700' },
  muted: { color: '#6b7280', fontSize: 13 },
  rowActions: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  primaryButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonSmall: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  laborCard: { marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 },
  laborLabel: { fontWeight: '700', marginBottom: 8, color: '#1f2937' },
  laborControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  laborValue: { minWidth: 45, textAlign: 'center', fontWeight: '700' },
  laborRateInput: {
    width: 90,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryBox: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  summaryLine: { color: '#374151', marginBottom: 4 },
  summaryTotal: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 },
  disabledButton: { opacity: 0.6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
});
