import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface YahooQuote {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: { fmt: string; raw: number };
  regularMarketChange?: { fmt: string; raw: number };
  regularMarketChangePercent?: { fmt: string; raw: number };
  regularMarketVolume?: { fmt: string; longFmt: string };
  marketCap?: { raw: number; fmt: string };
}

interface Stock {
  ticker: string;
  name: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
  raw_change: number;
}

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ value: number }[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const formatQuote = (quote: YahooQuote): Stock => ({
    ticker: quote.symbol,
    name: quote.shortName || quote.symbol,
    price: quote.regularMarketPrice?.fmt || '0.00',
    change_amount: quote.regularMarketChange?.fmt || '0.00',
    change_percentage: quote.regularMarketChangePercent?.fmt || '0.00%',
    volume: quote.regularMarketVolume?.fmt || '0',
    raw_change: quote.regularMarketChange?.raw || 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [gainersRes, losersRes] = await Promise.all([
        fetch('https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=true&lang=en-IN&region=IN&scrIds=day_gainers_in&count=250'),
        fetch('https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=true&lang=en-IN&region=IN&scrIds=day_losers_in&count=250')
      ]);

      const gainersJson = await gainersRes.json();
      const losersJson = await losersRes.json();

      const rawGainers: YahooQuote[] = gainersJson.finance?.result?.[0]?.quotes || [];
      const rawLosers: YahooQuote[] = losersJson.finance?.result?.[0]?.quotes || [];

      // Filter for Market Cap > 10,000 Crores to ensure reputable Nifty stocks
      const MIN_MARKET_CAP = 100000000000;
      const filterAndFormat = (quotes: YahooQuote[]) => {
        return quotes
          .filter(q => q.marketCap && q.marketCap.raw > MIN_MARKET_CAP)
          .slice(0, 15)
          .map(formatQuote);
      };

      setGainers(filterAndFormat(rawGainers));
      setLosers(filterAndFormat(rawLosers));
    } catch (err) {
      setError('Failed to fetch Indian stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (ticker: string) => {
    try {
      setChartLoading(true);
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1d&interval=15m`);
      const json = await res.json();
      const closePrices = json.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
      
      const formattedChart = closePrices
        .filter((price: number | null) => price !== null)
        .map((price: number) => ({ value: price }));
        
      setChartData(formattedChart);
    } catch (e) {
      console.error(e);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  const handlePress = (ticker: string) => {
    if (expandedTicker === ticker) {
      setExpandedTicker(null);
    } else {
      setExpandedTicker(ticker);
      setChartData([]);
      fetchChartData(ticker);
    }
  };

  const renderItem = ({ item }: { item: Stock }) => {
    const isGainer = item.raw_change >= 0;
    const color = isGainer ? '#4caf50' : '#f44336';
    const sign = isGainer ? '+' : '';
    const isExpanded = expandedTicker === item.ticker;

    return (
      <TouchableOpacity 
        style={[styles.itemContainer, isExpanded && styles.expandedItemContainer]}
        activeOpacity={0.7}
        onPress={() => handlePress(item.ticker)}
      >
        <View style={styles.row}>
          <View style={styles.tickerContainer}>
            <Text style={styles.tickerText}>{item.ticker.replace('.NS', '').replace('.BO', '')}</Text>
            <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{item.price}</Text>
            <Text style={[styles.changeText, { color }]}>
              {sign}{item.change_amount} ({item.change_percentage})
            </Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.chartContainer}>
            {chartLoading ? (
              <ActivityIndicator size="small" color="#2196f3" style={{ padding: 20 }} />
            ) : chartData.length > 0 ? (
              <LineChart
                data={chartData}
                width={screenWidth - 80}
                height={120}
                thickness={2}
                color={color}
                hideDataPoints
                hideRules
                hideYAxisText
                hideAxesAndRules
                curved
              />
            ) : (
              <Text style={styles.noDataText}>Chart data not available</Text>
            )}
            <View style={styles.detailsRow}>
              <Text style={styles.volumeText}>Volume Today: {item.volume}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Indian Markets</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'gainers' && styles.activeTabGainers]}
          onPress={() => setActiveTab('gainers')}
        >
          <Text style={[styles.tabText, activeTab === 'gainers' && styles.activeTabText]}>
            Top Gainers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'losers' && styles.activeTabLosers]}
          onPress={() => setActiveTab('losers')}
        >
          <Text style={[styles.tabText, activeTab === 'losers' && styles.activeTabText]}>
            Top Losers
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={activeTab === 'gainers' ? gainers : losers}
            keyExtractor={(item) => item.ticker}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#eeeeee', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333333' },
  tabContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#ffffff' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', marginHorizontal: 4 },
  activeTabGainers: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  activeTabLosers: { backgroundColor: '#f44336', borderColor: '#f44336' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#666666' },
  activeTabText: { color: '#ffffff' },
  contentContainer: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#f44336', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#2196f3', borderRadius: 8 },
  retryText: { color: '#ffffff', fontWeight: 'bold' },
  listContainer: { padding: 16 },
  itemContainer: { backgroundColor: '#ffffff', padding: 16, marginBottom: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  expandedItemContainer: { borderColor: '#e0e0e0', borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  tickerContainer: { flex: 1, paddingRight: 16 },
  tickerText: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 2 },
  nameText: { fontSize: 12, color: '#666666', marginBottom: 4 },
  priceContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 4 },
  changeText: { fontSize: 14, fontWeight: '600' },
  chartContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#eeeeee', alignItems: 'center' },
  noDataText: { color: '#999', marginVertical: 20 },
  detailsRow: { width: '100%', marginTop: 12, alignItems: 'center' },
  volumeText: { fontSize: 12, color: '#888', fontWeight: '500' }
});
