import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PURPLE = '#5B2D8E';

export default function PositionsScreen() {
  const insets = useSafeAreaInsets();
const [activeFilter, setActiveFilter] = useState('Regular');
  const filters = ['Regular (0)', 'MTF (0)', 'Strategy (0)'];

  return (
    <View style={styles.screen}>
            {/* Announcement Banner */}
      <TouchableOpacity style={[styles.holidayBanner, { paddingVertical: 12 }]}>
        <Ionicons name="information-circle" size={20} color="#000" style={{ marginTop: 2, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.holidayBannerText}>14 Sept is a trading holiday on account of Ganesh Chaturthi</Text>
        </View>
        <Text style={styles.knowMoreText}>Know more</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Positions</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="search-outline" size={22} color="#fff" /></TouchableOpacity>
        </View>
      </View>
      

      

            
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.pnlLabel}>Day's P&L</Text>
            <Text style={[styles.pnlValueZero, { color: '#262626' }]}>0.00</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.pnlLabel}>Overall P&L</Text>
            <Text style={[styles.pnlValueZero, { color: '#262626' }]}>0.00</Text>
          </View>
        </View>

        <View style={styles.emptyBox}>
          <Ionicons name="compass-outline" size={54} color="#ccc" />
          <Text style={styles.emptyTextTitle}>No positions yet.</Text>
          <Text style={styles.emptyTextSub}>You'll find your Intraday positions here</Text>
          <TouchableOpacity style={styles.goBtn}>
            <Text style={styles.goBtnText}>Go to My lists</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    holidayBanner: { backgroundColor: '#ffffff', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start' },
  holidayBannerText: { color: '#000', fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  knowMoreText: { color: '#000', fontSize: 13, fontFamily: 'Inter_700Bold', marginLeft: 10, marginTop: 2 },screen: { flex: 1, backgroundColor: '#f4f4f8' },
  header: { backgroundColor: PURPLE, paddingTop: 12, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_500Medium' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },
  scrollView: { flex: 1 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  pill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff' },
  activePill: { backgroundColor: PURPLE, borderColor: PURPLE },
  pillText: { fontSize: 13, color: '#555', fontFamily: 'Inter_500Medium' },
  activePillText: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  pnlRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  pnlLabel: { fontSize: 11, color: '#888', marginBottom: 3, fontFamily: 'Inter_400Regular' },
  pnlValueZero: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTextTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#262626', marginTop: 16 },
  emptyTextSub: { fontSize: 14, color: '#666', marginTop: 6, fontFamily: 'Inter_400Regular' },
  goBtn: { marginTop: 24, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, borderWidth: 1, borderColor: '#aaa' },
  goBtnText: { color: '#262626', fontFamily: 'Inter_500Medium', fontSize: 14 },
});















