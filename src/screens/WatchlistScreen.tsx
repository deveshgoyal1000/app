import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stocksData = require('../../data/stocks.json');

export default function WatchlistScreen() {
  const [logoFailed, setLogoFailed] = useState(false);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.stockRow}>
      <View style={styles.leftCol}>
        <Text style={styles.symbolText}>{item.symbol}</Text>
        <Text style={styles.exchangeText}>{item.exchange}  |  EQ</Text>
      </View>
      <View style={styles.rightCol}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: item.isUp ? '#1DB954' : '#E53935' }]}>
            {item.price.toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.changeText, { color: '#888' }]}>
          {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.isUp ? '+' : ''}{item.changePercentage.toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Top Header */}
        <View style={styles.topAppBar}>
          <TouchableOpacity style={styles.profileAvatar}>
            <Text style={styles.profileText}>JD</Text>
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            {!logoFailed ? (
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Upstox_Logo.png' }} 
                style={styles.logoImage} 
                resizeMode="contain"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Text style={{ fontSize: 24, fontWeight: '900', color: '#56328c', letterSpacing: -1 }}>upstox</Text>
                 <Ionicons name="arrow-up-circle" size={20} color="#56328c" style={{ marginLeft: 2, marginTop: -8 }} />
              </View>
            )}
          </View>
          
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Top Market Indices */}
        <View style={styles.indicesContainer}>
          <View style={styles.indexBox}>
            <Text style={styles.indexName}>NIFTY 50</Text>
            <View style={styles.indexPriceRow}>
              <Text style={styles.indexPrice}>19,542.65</Text>
              <Text style={styles.indexChange}>+12.50 (0.06%)</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.indexBox}>
            <Text style={styles.indexName}>SENSEX</Text>
            <View style={styles.indexPriceRow}>
              <Text style={styles.indexPrice}>65,344.17</Text>
              <Text style={styles.indexChange}>+22.71 (0.03%)</Text>
            </View>
          </View>
        </View>

        {/* Watchlist Header */}
        <View style={styles.watchlistHeader}>
          <TouchableOpacity style={styles.watchlistSelector}>
            <Text style={styles.watchlistTitle}>My List</Text>
            <Ionicons name="chevron-down" size={18} color="#333" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="options-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="add" size={26} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Column Labels */}
        <View style={styles.columnHeaders}>
          <Text style={styles.columnHeaderLeft}>Symbol</Text>
          <Text style={styles.columnHeaderRight}>LTP</Text>
        </View>

        {/* Stock List */}
        <FlatList
          data={stocksData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // Max width for web to make it look like a mobile app in the center
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#56328c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  logoImage: {
    width: 120,
    height: 30,
  },
  indicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  indexBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  indexName: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  indexPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  indexChange: {
    fontSize: 12,
    color: '#1DB954',
    fontWeight: '600',
  },
  watchlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  watchlistSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchlistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 20,
  },
  columnHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  columnHeaderLeft: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  columnHeaderRight: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  leftCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  exchangeText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  rightCol: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
});
