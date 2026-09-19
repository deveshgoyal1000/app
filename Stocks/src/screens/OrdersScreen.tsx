import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('Open');

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trades</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        {['Open', 'Closed'].map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.container}>
        <Ionicons name="document-text-outline" size={64} color="#ddd" />
        <Text style={styles.title}>No {activeTab.toLowerCase()} orders</Text>
        <Text style={styles.subtitle}>Place an order from the Watchlist</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f8' },
  header: {
    backgroundColor: PURPLE,
    paddingTop: 0,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_600SemiBold' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#888', fontFamily: 'Inter_400Regular' },
  activeTabText: { color: '#111', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  tabUnderline: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 3, backgroundColor: '#111', borderRadius: 2 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    fontFamily: 'Inter_400Regular'
  },
});
