import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSystemAndImeBottomInset } from '../hooks/useSystemBottomInset';
const stocksData = require('../../data/stocks.json');

export default function SearchModal({
  visible,
  onClose,
  onSelect
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (stock: any) => void;
}) {
  const insets = useSafeAreaInsets();
  const bottomInset = useSystemAndImeBottomInset();
  const [query, setQuery] = useState('');

  const filteredStocks = useMemo(() => {
    if (!query.trim()) return stocksData;
    const lowerQuery = query.toLowerCase();
    return stocksData.filter((s: any) => 
      s.symbol.toLowerCase().includes(lowerQuery) || 
      s.name.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top, paddingBottom: bottomInset }]}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search for a company or stock"
              placeholderTextColor="#888"
              autoFocus
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredStocks}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultItem} 
              onPress={() => {
                onSelect({ ...item, name: item.symbol, ltp: item.price, prevClose: item.price - item.change });
                onClose();
              }}
            >
              <View>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.price}>{item.price.toFixed(2)}</Text>
                <Text style={styles.exchange}>{item.exchange}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No results found for "{query}"</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 8 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, marginLeft: 8, height: 40 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#111', fontFamily: 'Inter_400Regular' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 16, fontFamily: 'Inter_400Regular' },
  resultItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  symbol: { fontSize: 15, color: '#111', fontFamily: 'Inter_500Medium' },
  name: { fontSize: 12, color: '#888', fontFamily: 'Inter_400Regular', marginTop: 2 },
  price: { fontSize: 14, color: '#111', fontFamily: 'Inter_500Medium' },
  exchange: { fontSize: 10, color: '#888', fontFamily: 'Inter_600SemiBold', marginTop: 2 },
});
