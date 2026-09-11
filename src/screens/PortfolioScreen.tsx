import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';
const GREEN = '#0B8062';
const RED = '#DA5329';

const holdings = [
  { id: '1', name: 'PAYTM', exchange: 'NSE', qty: '100', pnl: '-60,000.00 (-60.0%)', pnlColor: RED, avg: '1000.00 Avg.', ltp: '400.00 LTP', ltpColor: RED },
  { id: '2', name: 'HDFCBANK', exchange: 'NSE', qty: '100', pnl: '-30,000.00 (-20.0%)', pnlColor: RED, avg: '1500.00 Avg.', ltp: '1200.00 LTP', ltpColor: RED },
  { id: '3', name: 'WIPRO', exchange: 'NSE', qty: '200', pnl: '-21,000.00 (-17.5%)', pnlColor: RED, avg: '600.00 Avg.', ltp: '495.00 LTP', ltpColor: RED },
];

export default function PortfolioScreen() {
  const [activeTab, setActiveTab] = useState('Positions');
  const [activeFilter, setActiveFilter] = useState('Regular');
  
  const filters = ['Regular (0)', 'MTF (0)', 'Strategy (0)'];

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="notifications-outline" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="share-outline" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="options-outline" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="search-outline" size={22} color="#fff" /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        {['Positions', 'Holdings'].map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'Positions' ? 'Positions (0)' : 'Holdings (3)'}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {activeTab === 'Positions' && (
          <>
            {/* The 3 sections (Filters) brought back as empty */}
            <View style={styles.filterRow}>
              {filters.map(f => {
                const key = f.split(' ')[0];
                const isActive = activeFilter === key;
                return (
                  <TouchableOpacity key={f} style={[styles.pill, isActive && styles.activePill]} onPress={() => setActiveFilter(key)}>
                    <Text style={[styles.pillText, isActive && styles.activePillText]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.pnlRow}>
              <View>
                <Text style={styles.pnlLabel}>Today's P&L</Text>
                <Text style={[styles.pnlValueZero, { color: '#111' }]}>0.00</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.pnlLabel}>Overall P&L</Text>
                <Text style={[styles.pnlValueZero, { color: '#111' }]}>0.00</Text>
              </View>
            </View>

            <View style={styles.emptyBox}>
              <Ionicons name="briefcase-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No positions yet</Text>
            </View>
          </>
        )}

        {activeTab === 'Holdings' && (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Investment</Text>
                <Text style={styles.summaryValue}>3,62,000.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Current Value</Text>
                <Text style={styles.summaryValue}>3,02,000.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryDivider]}>
                <Text style={styles.summaryLabel}>Total Returns</Text>
                <Text style={[styles.summaryValue, { color: RED }]}>-60,000.00</Text>
              </View>
            </View>

            {holdings.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.cardLeft}>
                    <View style={styles.nameRow}>
                      <Text style={styles.stockName}>{item.name}</Text>
                      <Ionicons name="notifications-outline" size={13} color="#bbb" style={{ marginLeft: 6 }} />
                    </View>
                    <Text style={styles.subInfo}>{item.exchange}{'  -  Delivery  -  Qty. '}<Text style={{ color: GREEN, fontFamily: 'Inter_600SemiBold' }}>{item.qty}</Text></Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.pnlValue, { color: item.pnlColor }]}>{item.pnl}</Text>
                    <Text style={styles.avgText}>{item.avg}</Text>
                    <Text style={[styles.ltpText, { color: item.ltpColor }]}>{item.ltp}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f8' },
  header: { backgroundColor: PURPLE, paddingTop: Platform.OS === 'android' ? 16 : 50, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_600SemiBold' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, color: '#888', fontFamily: 'Inter_400Regular' },
  activeTabText: { color: '#111', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  tabUnderline: { position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 3, backgroundColor: '#111', borderRadius: 2 },
  scrollView: { flex: 1 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  pill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff' },
  activePill: { backgroundColor: PURPLE, borderColor: PURPLE },
  pillText: { fontSize: 13, color: '#555', fontFamily: 'Inter_500Medium' },
  activePillText: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  pnlRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  pnlLabel: { fontSize: 12, color: '#888', marginBottom: 3, fontFamily: 'Inter_400Regular' },
  pnlValueZero: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  summaryCard: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, marginBottom: 12, borderRadius: 10, padding: 16, elevation: 1, borderWidth: 1, borderColor: '#f0f0f0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryDivider: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, marginTop: 4, marginBottom: 0 },
  summaryLabel: { fontSize: 13, color: '#666', fontFamily: 'Inter_400Regular' },
  summaryValue: { fontSize: 14, color: '#111', fontFamily: 'Inter_500Medium' },
  card: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 10, padding: 14, elevation: 1, borderWidth: 1, borderColor: '#f0f0f0' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLeft: { flex: 1, marginRight: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  stockName: { fontSize: 15, fontFamily: 'Inter_500Medium', color: '#1a1a1a' },
  subInfo: { fontSize: 12, color: '#888', fontFamily: 'Inter_400Regular' },
  pnlValue: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'right' },
  avgText: { fontSize: 12, color: '#888', textAlign: 'right', marginTop: 2, fontFamily: 'Inter_400Regular' },
  ltpText: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'right', marginTop: 2 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 14, color: '#aaa', marginTop: 12, fontFamily: 'Inter_400Regular' },
});

