import React, { useState, useEffect, useRef, useMemo } from 'react';
import FastToast from './FastToast';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, PanResponder, Alert, ToastAndroid, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Path, Line, Circle } from 'react-native-svg';

const SCREEN_W = Dimensions.get('window').width;
const CHART_H = 220;
const AXIS_W = 50;
const TEXT_GREY = '#666666';

// Pure SVG Interactive Chart
function StockChart({
  data, width, height, prevClose, ltp, avg,
}: {
  data: { c: number; time: string }[];
  width: number; height: number;
  prevClose: number; ltp: number; avg?: number;
}) {
  const [scrubIdx, setScrubIdx] = useState<number | null>(null);
  const zoomRef = useRef(1);
  const panRef = useRef(0);
  const [viewState, setViewState] = useState({ zoom: 1, pan: 0 });

  useEffect(() => {
    zoomRef.current = 1; panRef.current = 0;
    setViewState({ zoom: 1, pan: 0 });
    setScrubIdx(null);
  }, [data]);

  const chartW = width - AXIS_W;
  const isPositive = data.length > 0 ? data[data.length - 1].c >= data[0].c : ltp >= (avg ?? prevClose);
  const CHART_COLOR = isPositive ? '#0B8062' : '#DA5329';

  const totalPts = data.length;
  const visiblePts = Math.max(5, Math.round(totalPts / viewState.zoom));
  const maxPan = Math.max(0, totalPts - visiblePts);
  const panStart = Math.min(maxPan, Math.max(0, Math.round(viewState.pan)));
  const visible = data.slice(panStart, panStart + visiblePts);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.locationX;
        const ptIdx = Math.round((x / chartW) * (visible.length - 1));
        setScrubIdx(Math.max(0, Math.min(ptIdx, visible.length - 1)));
      },
      onPanResponderMove: (e, gs) => {
        if (gs.numberActiveTouches === 2) {
          setScrubIdx(null);
        } else if (gs.numberActiveTouches === 1) {
          const x = e.nativeEvent.locationX;
          const ptIdx = Math.round((x / chartW) * (visible.length - 1));
          setScrubIdx(Math.max(0, Math.min(ptIdx, visible.length - 1)));
        }
      },
      onPanResponderRelease: () => setScrubIdx(null),
    })
  ).current;

  if (visible.length < 2) return <View style={{ height, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;

  const dataMin = Math.min(...data.map(d => d.c));
  const dataMax = Math.max(...data.map(d => d.c));
  const dataRange = dataMax - dataMin || 1;
  const yMin = dataMin - dataRange * 0.1;
  const yMax = dataMax + dataRange * 0.1;
  const yRange = yMax - yMin;

  const toX = (i: number) => (i / (visible.length - 1)) * chartW;
  const toY = (v: number) => CHART_H - ((v - yMin) / yRange) * CHART_H;

  const area = `M 0,${CHART_H} ` + visible.map((d, i) => `L ${toX(i)},${toY(d.c)}`).join(' ') + ` L ${chartW},${CHART_H} Z`;
  const line = visible.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(d.c)}`).join(' ');

  const fmtPrice = (p: number) => {
    if (p >= 100) return Math.round(p).toString();
    return p.toFixed(2);
  };
  const yLabels = [yMax, yMin + (yRange * 0.66), yMin + (yRange * 0.33), yMin].map(p => ({ price: p, y: toY(p) }));
  const prevCloseY = toY(prevClose);
  const ltpY = toY(ltp);
  const inRange = (p: number) => p >= yMin && p <= yMax;

  const scrubPrice = scrubIdx !== null ? visible[scrubIdx]?.c : null;
  const scrubTime  = scrubIdx !== null ? visible[scrubIdx]?.time : null;
  const scrubX     = scrubIdx !== null ? toX(scrubIdx) : null;
  const scrubY     = scrubIdx !== null ? toY(visible[scrubIdx]?.c ?? 0) : null;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: chartW, height: CHART_H }} {...panResponder.panHandlers}>
          <Svg width={chartW} height={CHART_H}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={CHART_COLOR} stopOpacity="0.25" />
                <Stop offset="100%" stopColor={CHART_COLOR} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            {yLabels.map((l, i) => (
              <Line key={i} x1={0} y1={l.y} x2={chartW} y2={l.y} stroke="#eeeeee" strokeWidth={1} />
            ))}
            {inRange(prevClose) && (
              <Line x1={0} y1={prevCloseY} x2={chartW} y2={prevCloseY} stroke="#999999" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.6} />
            )}
            <Path d={area} fill="url(#grad)" />
            <Path d={line} stroke={CHART_COLOR} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {scrubX !== null && scrubY !== null && (
              <>
                <Line x1={scrubX} y1={0} x2={scrubX} y2={CHART_H} stroke={CHART_COLOR} strokeWidth={1.5} strokeDasharray="4,3" />
                <Circle cx={scrubX} cy={scrubY} r={5} fill="#fff" stroke={CHART_COLOR} strokeWidth={2} />
              </>
            )}
          </Svg>
        </View>

        <View style={{ width: AXIS_W, height: CHART_H, position: 'relative' }}>
          {yLabels.map((l, i) => (
            <Text key={i} style={[styles.yAxisText, { top: l.y - 8 }]}>{fmtPrice(l.price)}</Text>
          ))}
          {inRange(ltp) && (
            <View style={[styles.ltpBox, { top: ltpY - 10, borderColor: CHART_COLOR }]}>
              <Text style={[styles.ltpBoxText, { color: CHART_COLOR }]}>{ltp.toFixed(2)}</Text>
            </View>
          )}
          {inRange(prevClose) && (
            <View style={[styles.prevCloseBox, { top: prevCloseY - 10 }]}>
              <Text style={styles.prevCloseBoxText}>{prevClose.toFixed(2)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ width: chartW, flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        {visible.length > 0 && <Text style={styles.xAxisLabel}>{visible[0].time}</Text>}
        {visible.length > 0 && <Text style={styles.xAxisLabel}>{visible[visible.length - 1].time}</Text>}
      </View>

      {scrubX !== null && scrubPrice !== null && scrubY !== null && (
        <View style={[styles.scrubTooltip, {
          backgroundColor: CHART_COLOR,
          left: Math.min(chartW - 96, Math.max(4, scrubX - 44)),
          top: Math.max(4, scrubY - 40),
        }]}>
          <Text style={styles.scrubPrice}>{'\u20B9'}{scrubPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <Text style={styles.scrubTime}>{scrubTime}</Text>
        </View>
      )}
    </View>
  );
}

const RANGE_CFG: Record<string, { interval: string; range: string; points: number }> = {
  '1D': { interval: '5m',  range: '1d',  points: 75 },
  '1W': { interval: '30m', range: '5d',  points: 60 },
  '1M': { interval: '1d',  range: '1mo', points: 30 },
  '3M': { interval: '1d',  range: '3mo', points: 90 },
  '1Y': { interval: '1wk', range: '1y',  points: 52 },
};

const genOffline = (stock: any, pts: number, rng: string) => {
  let price = stock.prevClose;
  const vol = stock.prevClose * (rng === '1D' ? 0.003 : rng === '1W' ? 0.008 : 0.015);
  return Array.from({ length: pts }, (_, i) => {
    price = Math.max(price + (Math.random() - 0.47) * vol, stock.prevClose * 0.7);
    if (i === pts - 1) price = stock.ltp;
    let label = '';
    if (rng === '1D') {
      const h = 9 + Math.floor(i / 12), m = (i % 12) * 5;
      label = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    } else {
      const d = new Date(); d.setDate(d.getDate() - (pts - 1 - i));
      label = `${d.getDate()}/${d.getMonth() + 1}`;
    }
    return { c: price, time: label };
  });
};

export default function SharedChartModal({
  stock, onClose
}: {
  stock: any;
  onClose: () => void;
}) {
  const [chartData, setChartData] = useState<{ c: number; time: string }[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRange, setChartRange] = useState('1Y');
  const fastToastRef = React.useRef<any>(null);
  const [chartLayout, setChartLayout] = useState({ width: SCREEN_W, height: 320 });
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (stock) {
      setChartRange('1Y');
    }
  }, [stock]);



  useEffect(() => {
    if (!stock) { setChartData([]); return; }
    setChartLoading(true);
    const cfg = RANGE_CFG[chartRange];
    
    if (stock.name === 'RAJESHEXPO' || stock.symbol === 'RAJESHEXPO') {
      const pts = cfg.points;
      const data = [];
      const now = new Date();
      const is1D = chartRange === '1D';
      
      let startPrice = 98;
      let midPrice: number | null = null;
      let midIndex: number | null = null;
      
      if (chartRange === '1Y') {
        startPrice = stock.avg || 540; 
        midPrice = 15; 
        midIndex = Math.floor(pts * 0.15);
      } else if (chartRange === '3M') {
        startPrice = 15; 
      } else if (chartRange === '1M') {
        startPrice = 50; 
      } else if (chartRange === '1W') {
        startPrice = 80; 
      } else { 
        startPrice = stock.prevClose; 
      }

      for(let i = 0; i < pts; i++) {
         let c;
         const progress = i / (pts - 1);
         if (midPrice !== null && midIndex !== null) {
            if (i < midIndex) {
               const dropProg = i / midIndex;
               c = startPrice - dropProg * (startPrice - midPrice);
            } else {
               const recProg = (i - midIndex) / (pts - 1 - midIndex);
               c = midPrice + recProg * (stock.ltp - midPrice);
            }
         } else {
            c = startPrice + progress * (stock.ltp - startPrice);
         }
         
         const vol = (chartRange === '1Y' || chartRange === '3M') ? 15 : (chartRange === '1M' ? 8 : 2);
         if (i > 0 && i < pts - 1) c += (Math.random() - 0.5) * vol;
         if (i === pts - 1) c = stock.ltp;
         
         let label = '';
         if (is1D) {
           const h = 9 + Math.floor(i / (pts/6.5)), m = Math.floor((i % (pts/6.5)) * (60/(pts/6.5)));
           label = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
         } else if (chartRange === '1Y') {
           const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
           label = months[Math.floor((i / pts) * months.length)];
         } else {
           const d = new Date(now.getTime() - (pts - 1 - i) * 86400000 * (chartRange==='1W'?1:chartRange==='1M'?1:3));
           label = `${d.getDate()}/${d.getMonth() + 1}`;
         }
         data.push({ c: Math.max(1, c), time: label });
      }
      setChartData(data);
      setChartLoading(false);
      return;
    }

    const symbolToFetch = stock.symbol || stock.name;
    fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbolToFetch}.NS?interval=${cfg.interval}&range=${cfg.range}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      .then(r => r.json())
      .then(d => {
        if (d.chart.error || !d.chart.result) throw new Error();
        const res = d.chart.result[0];
        const closes = res.indicators.quote[0].close;
        const tss    = res.timestamp;
        const candles = closes.map((c: number, i: number) => {
          if (c == null) return null;
          const dt = new Date(tss[i] * 1000);
          const label = chartRange === '1D'
            ? dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
            : `${dt.getDate()}/${dt.getMonth() + 1}`;
          return { c, time: label };
        }).filter(Boolean) as { c: number; time: string }[];
        setChartData(candles);
        setChartLoading(false);
      })
      .catch(() => {
        setChartData(genOffline(stock, cfg.points, chartRange));
        setChartLoading(false);
      });
  }, [stock, chartRange]);

    const showMarketClosed = () => {
    fastToastRef.current?.show(`Market is currently closed.
Please trade between 9:15 AM - 3:30 PM`);
  };

  if (!stock) return null;

  const modalIsPositive = chartData.length > 0 ? chartData[chartData.length - 1].c >= chartData[0].c : (stock.ltp >= (stock.avg ?? stock.prevClose));
  const modalChartColor = modalIsPositive ? '#0B8062' : '#DA5329';
  const priceChange = stock.ltp - stock.prevClose;
  const priceChangePct = (priceChange / stock.prevClose) * 100;

  return (
    <Modal visible={!!stock} animationType="slide" transparent={true} statusBarTranslucent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>{stock.name || stock.symbol}</Text>
              <Text style={styles.chartSub}>NSE</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.chartLtp}>{'\u20B9'}{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              <Text style={[styles.chartChange, { color: priceChange >= 0 ? '#0B8062' : '#DA5329' }]}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChange >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={styles.rangeBar}>
            {['1D', '1W', '1M', '3M', '1Y'].map(r => (
              <TouchableOpacity key={r} style={[styles.rangeBtn, chartRange === r && { backgroundColor: modalChartColor }]} onPress={() => setChartRange(r)}>
                <Text style={[styles.rangeBtnText, chartRange === r && styles.rangeBtnTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.chartArea} onLayout={e => setChartLayout(e.nativeEvent.layout)}>
            {chartLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#888' }}>Loading chart...</Text>
              </View>
            ) : chartData.length > 1 && chartLayout.width > 0 ? (
              <StockChart
                data={chartData}
                width={chartLayout.width}
                height={chartLayout.height}
                prevClose={stock.prevClose}
                ltp={stock.ltp}
                avg={stock.avg}
              />
            ) : null}
          </View>


          <View style={[styles.chartBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TouchableOpacity style={[styles.chartActionBtn, { backgroundColor: '#0B8062' }]} onPress={() => showMarketClosed()}>
              <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold' }}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chartActionBtn, { backgroundColor: '#DA5329' }]} onPress={() => showMarketClosed()}>
              <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold' }}>SELL</Text>
            </TouchableOpacity>
          </View>
          <FastToast ref={fastToastRef} bottomOffset={80} />
        </View>
              </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBg: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, height: '70%', paddingTop: 8, elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: -5 } },
  modalHandle: { width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  chartTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#111' },
  chartSub: { fontSize: 12, color: '#666', fontFamily: 'Inter_400Regular', marginTop: 2 },
  chartLtp: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#111' },
  chartChange: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 2 },
  rangeBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rangeBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  rangeBtnActive: { backgroundColor: '#0B8062' },
  rangeBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#888' },
  rangeBtnTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  chartArea: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' },
  yAxisText: { position: 'absolute', right: 4, fontSize: 10, color: TEXT_GREY, fontFamily: 'Inter_400Regular' },
  ltpBox: { position: 'absolute', right: 2, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#111', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3 },
  ltpBoxText: { fontSize: 10, color: '#111', fontFamily: 'Inter_600SemiBold' },
  prevCloseBox: { position: 'absolute', right: 2, backgroundColor: '#888888', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3 },
  prevCloseBoxText: { fontSize: 10, color: '#fff', fontFamily: 'Inter_600SemiBold' },
  xAxisLabel: { fontSize: 10, color: TEXT_GREY, fontFamily: 'Inter_400Regular' },
  scrubTooltip: { position: 'absolute', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, zIndex: 10 },
  scrubPrice: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  scrubTime: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'Inter_400Regular' },
  chartBottomBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 12 },
  chartActionBtn: { flex: 1, height: 44, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
});
