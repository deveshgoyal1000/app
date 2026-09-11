import React, { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';
const GREEN = '#0B8062';
const RED = '#DA5329';
const DARK = '#262626';

const rawHoldings = [
  { id: '1', name: 'PAYTM', qty: 100, avg: 1431.84, prevClose: 1102.74, ltp: 1107.74 },
  { id: '2', name: 'HDFCBANK', qty: 80, avg: 1581.20, prevClose: 1344.62, ltp: 1349.62 },
  { id: '3', name: 'SHRIRAMFIN', qty: 50, avg: 1846.40, prevClose: 1667.70, ltp: 1676.70 },
];

const formatCurrency = (num) => {
  let str = Math.abs(num).toFixed(2);
  let parts = str.split('.');
  let intPart = parts[0];
  let decPart = parts[1];
  
  let lastThree = intPart.substring(intPart.length - 3);
  let otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  
  let finalStr = res + '.' + decPart;
  return num < 0 ? '-' + finalStr : finalStr;
};

export default function HoldingsScreen() {
  const insets = useSafeAreaInsets();
const [activeTab, setActiveTab] = useState('Stocks');

  const {
    totalInvested,
    totalCurrent,
    totalReturn,
    totalReturnPercent,
    totalTodayReturn,
    totalTodayPercent,
    holdings
  } = useMemo(() => {
    let tInv = 0;
    let tCur = 0;
    let tPrevCur = 0;

    const computedHoldings = rawHoldings.map(h => {
      const invested = h.qty * h.avg;
      const current = h.qty * h.ltp;
      const prevCurrent = h.qty * h.prevClose;
      
      tInv += invested;
      tCur += current;
      tPrevCur += prevCurrent;

      const ret = current - invested;
      const retPercent = (ret / invested) * 100;
      
      const todayRet = current - prevCurrent;
      const todayPercent = ((h.ltp - h.prevClose) / h.prevClose) * 100;

      return {
        ...h,
        investedStr: formatCurrency(invested),
        avgStr: formatCurrency(h.avg),
        ltpStr: formatCurrency(h.ltp),
        totalReturnStr: `${ret >= 0 ? '+' : ''}${formatCurrency(ret)} (${ret >= 0 ? '+' : ''}${retPercent.toFixed(2)}%)`,
        returnColor: ret >= 0 ? GREEN : RED,
        ltpChangeStr: `(${todayPercent >= 0 ? '+' : ''}${todayPercent.toFixed(2)}%)`,
        ltpChangeColor: todayPercent >= 0 ? GREEN : RED,
      };
    });

    const tRet = tCur - tInv;
    const tRetP = (tRet / tInv) * 100;
    const tToday = tCur - tPrevCur;
    const tTodayP = (tToday / tPrevCur) * 100;

    return {
      totalInvested: formatCurrency(tInv),
      totalCurrent: formatCurrency(tCur),
      totalReturn: `${tRet >= 0 ? '+' : ''}${formatCurrency(tRet)} (${tRet >= 0 ? '+' : ''}${tRetP.toFixed(2)}%)`,
      totalReturnPercent: tRetP,
      totalTodayReturn: `${tToday >= 0 ? '+' : ''}${formatCurrency(tToday)} (${tToday >= 0 ? '+' : ''}${tTodayP.toFixed(2)}%)`,
      totalTodayPercent: tTodayP,
      holdings: computedHoldings
    };
  }, []);

  return (
    <View style={styles.screen}>
      {/* Announcement Banner */}
      <TouchableOpacity style={[styles.holidayBanner, { paddingTop: insets.top + 12 }]}>
        <Ionicons name="information-circle" size={20} color="#fff" style={{ marginTop: 2, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.holidayBannerText}>14 Sept is a trading holiday on account of Ganesh Chaturthi</Text>
        </View>
        <Text style={styles.knowMoreText}>Know more</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Holdings</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="search-outline" size={20} color="#fff" /></TouchableOpacity>
        </View>
      </View>

      {/* Indices Bar */}
      <View style={styles.indicesBar}>
        <View style={styles.indexBox}>
          <Text style={styles.indexNameRow}>NIFTY 50</Text>
          <View style={styles.indexValues}>
            <Text style={[styles.indexPrice, { color: RED }]}>23,398.10</Text>
            <Text style={styles.indexChange}>-79.70 (-0.34%)</Text>
          </View>
        </View>
        <View style={styles.indexDivider} />
        <View style={styles.indexBox}>
          <Text style={styles.indexNameRow}>SENSEX</Text>
          <View style={styles.indexValues}>
            <Text style={[styles.indexPrice, { color: RED }]}>74,781.76</Text>
            <Text style={styles.indexChange}>-120.83 (-0.16%)</Text>
          </View>
        </View>
      </View>

      {/* Top Tabs */}
      <View style={styles.topTabs}>
        <TouchableOpacity style={styles.topTab} onPress={() => setActiveTab('Stocks')}>
          <Text style={[styles.topTabText, activeTab === 'Stocks' && styles.topTabTextActive]}>Stocks (3)</Text>
          {activeTab === 'Stocks' && <View style={styles.topTabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.topTab} onPress={() => setActiveTab('MF')}>
          <Text style={[styles.topTabText, activeTab === 'MF' && styles.topTabTextActive]}>Mutual Funds</Text>
          {activeTab === 'MF' && <View style={styles.topTabUnderline} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'Stocks' ? (
          <>
            {/* Summary Section */}
            <View style={styles.summaryBlock}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.sumLabel}>Invested</Text>
                  <Text style={styles.sumVal}>{totalInvested}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.sumLabel}>Current</Text>
                  <Text style={styles.sumVal}>{totalCurrent}</Text>
                </View>
              </View>
              <View style={[styles.summaryRow, { marginTop: 12 }]}>
                <View>
                  <Text style={styles.sumLabel}>Total returns</Text>
                  <Text style={[styles.sumVal, { color: totalReturnPercent >= 0 ? GREEN : RED }]}>{totalReturn}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.sumLabel}>Today's returns</Text>
                  <Text style={[styles.sumVal, { color: totalTodayPercent >= 0 ? GREEN : RED }]}>{totalTodayReturn}</Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerThick} />

            {/* Stock List */}
            {holdings.map((item) => (
              <View key={item.id}>
                <View style={styles.listItem}>
                  
                  <View style={[styles.listRow, { marginBottom: 6 }]}>
                    <Text style={styles.stockName}>{item.name}</Text>
                    <Text style={[styles.stockReturn, { color: item.returnColor }]}>{item.totalReturnStr}</Text>
                  </View>

                  <View style={styles.listRow}>
                    <Text style={styles.stockSub}>Invested {item.investedStr}</Text>
                    <Text style={styles.stockSubRight}>{item.avgStr} Avg.</Text>
                  </View>

                  <View style={styles.listRow}>
                    <Text style={styles.stockSub}>Qty. {item.qty}</Text>
                    <Text style={styles.stockSubRight}>
                      {item.ltpStr} <Text style={{ color: item.ltpChangeColor }}>{item.ltpChangeStr}</Text> LTP
                    </Text>
                  </View>

                </View>
                <View style={styles.dividerThin} />
              </View>
            ))}
          </>
        ) : (
          /* Mutual Funds Empty State */
          <View style={styles.emptyBox}>
            <Ionicons name="pie-chart-outline" size={54} color="#ccc" />
            <Text style={styles.emptyTextTitle}>No mutual funds yet</Text>
            <Text style={styles.emptyTextSub}>Your mutual fund investments will appear here</Text>
            <TouchableOpacity style={styles.goBtn}>
              <Text style={styles.goBtnText}>Explore Funds</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  holidayBanner: { backgroundColor: '#00A3A1', paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start' },
  holidayBannerText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  knowMoreText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_700Bold', marginLeft: 10, marginTop: 2 },
  screen: { flex: 1, backgroundColor: '#fff' },
  
  header: { backgroundColor: PURPLE, paddingTop: 12, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_500Medium' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },

  indicesBar: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  indexBox: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indexNameRow: { fontSize: 11, color: DARK, fontFamily: 'Inter_600SemiBold', lineHeight: 14 },
  indexValues: { alignItems: 'flex-end' },
  indexPrice: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 2 },
  indexChange: { fontSize: 11, color: '#888', fontFamily: 'Inter_400Regular' },
  indexDivider: { width: 1, backgroundColor: '#eee', marginHorizontal: 12 },
  
  topTabs: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  topTab: { marginRight: 24, paddingVertical: 12, position: 'relative' },
  topTabText: { fontSize: 13, color: '#888', fontFamily: 'Inter_500Medium' },
  topTabTextActive: { color: DARK, fontFamily: 'Inter_600SemiBold' },
  topTabUnderline: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: DARK },

  scrollView: { flex: 1 },
  summaryBlock: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontSize: 11, color: '#888', fontFamily: 'Inter_400Regular', marginBottom: 2 },
  sumVal: { fontSize: 14, color: DARK, fontFamily: 'Inter_600SemiBold' },

  dividerThick: { height: 8, backgroundColor: '#f4f4f4', borderTopWidth: 1, borderTopColor: '#e0e0e0', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  dividerThin: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },

  listItem: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  stockName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: DARK },
  stockReturn: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  stockSub: { fontSize: 11, color: '#888', fontFamily: 'Inter_400Regular' },
  stockSubRight: { fontSize: 11, color: '#888', fontFamily: 'Inter_400Regular', textAlign: 'right' },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyTextTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: DARK, marginTop: 16 },
  emptyTextSub: { fontSize: 13, color: '#888', marginTop: 6, fontFamily: 'Inter_400Regular' },
  goBtn: { marginTop: 24, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, borderWidth: 1, borderColor: '#ccc' },
  goBtnText: { color: DARK, fontFamily: 'Inter_500Medium', fontSize: 13 },
});



