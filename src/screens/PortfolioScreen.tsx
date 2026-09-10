import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PortfolioScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Investment</Text>
          <Text style={styles.summaryValue}>₹ 1,50,000.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Current Value</Text>
          <Text style={styles.summaryValue}>₹ 1,62,450.50</Text>
        </View>
        <View style={[styles.summaryRow, styles.pnlRow]}>
          <Text style={styles.summaryLabel}>Total Returns</Text>
          <Text style={styles.profitText}>+₹ 12,450.50 (8.3%)</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Holdings (3)</Text>
      
      {/* Mock Holding 1 */}
      <View style={styles.holdingCard}>
        <View style={styles.row}>
          <Text style={styles.stockName}>RELIANCE</Text>
          <Text style={styles.stockQty}>20 Qty</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subText}>Avg. 2400.00</Text>
          <Text style={styles.priceText}>LTP 2450.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subText}>Invested: 48,000</Text>
          <Text style={styles.profitText}>+1,000.00</Text>
        </View>
      </View>

      {/* Mock Holding 2 */}
      <View style={styles.holdingCard}>
        <View style={styles.row}>
          <Text style={styles.stockName}>HDFCBANK</Text>
          <Text style={styles.stockQty}>50 Qty</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subText}>Avg. 1500.00</Text>
          <Text style={styles.priceText}>LTP 1490.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subText}>Invested: 75,000</Text>
          <Text style={styles.lossText}>-500.00</Text>
        </View>
      </View>

      {/* Mock Holding 3 */}
      <View style={styles.holdingCard}>
        <View style={styles.row}>
          <Text style={styles.stockName}>TCS</Text>
          <Text style={styles.stockQty}>10 Qty</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subText}>Avg. 2700.00</Text>
          <Text style={styles.priceText}>LTP 3895.05</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subText}>Invested: 27,000</Text>
          <Text style={styles.profitText}>+11,950.50</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  pnlRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  profitText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00b050',
  },
  lossText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#eb5b3c',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  holdingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  stockName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stockQty: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  subText: {
    fontSize: 12,
    color: '#888',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
