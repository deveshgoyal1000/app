import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SharedChartModal from '../components/SharedChartModal';
const PURPLE = '#5B2D8E';
const GREEN = '#0B8062';
const RED = '#DA5329';

const stocksData = require('../../data/stocks.json');

export default function WatchlistScreen() {
  const insets = useSafeAreaInsets();
  const [selectedStock, setSelectedStock] = useState<any>(null);
return (
    <SafeAreaView style={styles.screen}>
            {/* Announcement Banner */}
      <TouchableOpacity style={[styles.holidayBanner, { paddingVertical: 12 }]}>
        <Ionicons name="information-circle" size={20} color="#000" style={{ marginTop: 2, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.holidayBannerText}>14 Sept is a trading holiday on account of Ganesh Chaturthi</Text>
        </View>
        <Text style={styles.knowMoreText}>Know more</Text>
      </TouchableOpacity>

      {/* Purple Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>My List</Text>
            <Ionicons name="chevron-down" size={18} color="#fff" style={{ marginLeft: 4, marginTop: 2 }} />
          </View>
          <Text style={styles.headerSub}>20 scrips  -  List by you</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* NIFTY / BANK Bar */}
      <View style={styles.indicesBar}>
        <View style={styles.indexBox}>
          <Text style={styles.indexNameRow}>NIFTY 50</Text>
          <View style={styles.indexValues}>
            <Text style={styles.indexPrice}>19,784.10</Text>
            <Text style={styles.indexChange}>+41.75 (0.21%)</Text>
          </View>
        </View>
        <View style={styles.indexDivider} />
        <View style={styles.indexBox}>
          <Text style={styles.indexNameRow}>NIFTY{'\n'}BANK</Text>
          <View style={styles.indexValues}>
            <Text style={styles.indexPrice}>44,980.65</Text>
            <Text style={styles.indexChange}>+356.80 (0.80%)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sliderIcon}>
          <Ionicons name="chevron-down" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Column Headers */}
      <View style={styles.colHeaders}>
        <Text style={styles.colLeft}>Symbol</Text>
        <Text style={styles.colRight}>LTP</Text>
      </View>

      {/* Stock List */}
      <FlatList
        data={stocksData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => setSelectedStock({ ...item, name: item.symbol, ltp: item.price, prevClose: item.price - item.change })}>
            <View>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={styles.exchange}>{item.exchange}  EQ</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.price, { color: item.isUp ? GREEN : RED }]}>
                {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.change, { color: item.isUp ? GREEN : RED }]}>
                {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.isUp ? '+' : ''}{item.changePercentage.toFixed(2)}%)
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <SharedChartModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    holidayBanner: { backgroundColor: '#ffffff', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start' },
  holidayBannerText: { color: '#000', fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  knowMoreText: { color: '#000', fontSize: 13, fontFamily: 'Inter_700Bold', marginLeft: 10, marginTop: 2 },
  screen: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: PURPLE,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_500Medium' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2, fontFamily: 'Inter_400Regular' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 18 },
  indicesBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  indexBox: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  indexNameRow: { fontSize: 11, color: '#262626', fontFamily: 'Inter_600SemiBold', lineHeight: 14 },
  indexValues: { alignItems: 'flex-end' },
  indexPrice: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: GREEN },
  indexChange: { fontSize: 11, color: '#666', fontFamily: 'Inter_400Regular', marginTop: 2 },
  indexDivider: { width: 1, height: 32, backgroundColor: '#e0e0e0', marginHorizontal: 6 },
  sliderIcon: { paddingLeft: 8 },
  colHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colLeft: { fontSize: 12, color: '#888', fontFamily: 'Inter_600SemiBold' },
  colRight: { fontSize: 12, color: '#888', fontFamily: 'Inter_600SemiBold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  symbol: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#262626', marginBottom: 3 },
  exchange: { fontSize: 11, color: '#888', fontFamily: 'Inter_400Regular' },
  price: { fontSize: 14, fontFamily: 'Inter_500Medium', marginBottom: 3 },
  change: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  separator: { height: 1, backgroundColor: '#f2f2f2', marginLeft: 16 },
});



















