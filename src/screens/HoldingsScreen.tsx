import FastToast from '../components/FastToast';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, ActivityIndicator, TouchableWithoutFeedback,
  PanResponder, Dimensions, StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSystemAndImeBottomInset } from '../hooks/useSystemBottomInset';
import { Ionicons } from '@expo/vector-icons';
import { ToastAndroid, Platform, Alert } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const BG_MAIN = '#ffffff';
const BG_BOX = '#f8f9fa';
const TEXT_DARK = '#262626';
const TEXT_GREY = '#888888';
const GREEN = '#0B8062';
const RED = '#DA5329';
const BORDER = '#f2f2f2';
const PURPLE = '#5B2D8E';
const BLUE = '#2962FF';
const SCREEN_W = Dimensions.get('window').width;
const AXIS_W = 68;

// ─── Pure SVG Interactive Chart ────────────────────────────────────────────
function StockChart({
  data, width, height, prevClose, ltp, avg,
}: {
  data: { c: number; time: string }[];
  width: number; height: number;
  prevClose: number; ltp: number; avg: number;
}) {
  const [scrubIdx, setScrubIdx] = useState<number | null>(null);
  const zoomRef = useRef(1);
  const panRef = useRef(0); // index offset from left
  const [viewState, setViewState] = useState({ zoom: 1, pan: 0 });
  const lastPinchDist = useRef<number | null>(null);
  const lastPanX = useRef<number | null>(null);

  useEffect(() => {
    zoomRef.current = 1;
    panRef.current = 0;
    setViewState({ zoom: 1, pan: 0 });
    setScrubIdx(null);
  }, [data]);

  const chartW = width - AXIS_W;
  const isPositive = data.length > 0 ? data[data.length - 1].c >= data[0].c : ltp >= avg;
  const CHART_COLOR = isPositive ? '#0B8062' : '#DA5329';

  // Compute visible slice
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
        lastPinchDist.current = null;
        lastPanX.current = null;
      },

      onPanResponderMove: (e, gs) => {
        const touches = e.nativeEvent.touches;

        if (touches.length === 2) {
          // Pinch zoom
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (lastPinchDist.current !== null) {
            const delta = dist - lastPinchDist.current;
            zoomRef.current = Math.min(10, Math.max(0.5, zoomRef.current + delta * 0.02));
            setViewState(v => ({ ...v, zoom: zoomRef.current }));
          }
          lastPinchDist.current = dist;
          lastPanX.current = null;
        } else if (touches.length === 1) {
          // Pan or scrub
          const tx = touches[0].pageX;
          if (lastPanX.current !== null) {
            const diff = lastPanX.current - tx; // positive = scroll right (older)
            const idxDelta = (diff / chartW) * visiblePts;
            panRef.current = Math.min(maxPan, Math.max(0, panRef.current + idxDelta));
            setViewState(v => ({ ...v, pan: panRef.current }));
          }
          lastPanX.current = tx;

          // Scrubber: find closest index
          const localX = touches[0].locationX ?? gs.moveX;
          const idx = Math.min(visible.length - 1, Math.max(0, Math.round((localX / chartW) * (visible.length - 1))));
          setScrubIdx(idx);
        }
      },

      onPanResponderRelease: () => {
        lastPinchDist.current = null;
        lastPanX.current = null;
        setScrubIdx(null);
      },
    })
  ).current;

  if (visible.length < 2) return null;

  const prices = visible.map(d => d.c);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = (maxP - minP) || 1;
  const pad = range * 0.12;
  const yMin = minP - pad;
  const yMax = maxP + pad;
  const yRange = yMax - yMin;
  const CHART_H = height - 24; // leave room for x labels

  const toX = (i: number) => (i / (visible.length - 1)) * chartW;
  const toY = (p: number) => CHART_H - ((p - yMin) / yRange) * CHART_H;

  // Build SVG paths
  let line = '';
  let area = `M ${toX(0)} ${CHART_H}`;
  visible.forEach((d, i) => {
    const x = toX(i);
    const y = toY(d.c);
    if (i === 0) { line = `M ${x} ${y}`; area += ` L ${x} ${y}`; }
    else { line += ` L ${x} ${y}`; area += ` L ${x} ${y}`; }
  });
  area += ` L ${toX(visible.length - 1)} ${CHART_H} Z`;

  // Y axis labels (5 steps)
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    price: yMin + t * yRange,
    y: toY(yMin + t * yRange),
  })).reverse();

  // Smart price formatter for Y axis
  const fmtPrice = (p: number) => {
    const range = yMax - yMin;
    if (range < 1) return p.toFixed(2);
    if (range < 10) return p.toFixed(1);
    return Math.round(p).toLocaleString('en-IN');
  };

  // X axis labels (4 evenly spaced)
  const xLabels = [0, 1, 2, 3].map(i => {
    const idx = Math.round((i / 3) * (visible.length - 1));
    return { label: visible[idx]?.time ?? '', x: toX(idx) };
  });

  const prevCloseY = toY(prevClose);
  const ltpY = toY(ltp);
  const inRange = (p: number) => p >= yMin && p <= yMax;

  const scrubPrice = scrubIdx !== null ? visible[scrubIdx]?.c : null;
  const scrubTime  = scrubIdx !== null ? visible[scrubIdx]?.time : null;
  const scrubX     = scrubIdx !== null ? toX(scrubIdx) : null;
  const scrubY     = scrubIdx !== null ? toY(visible[scrubIdx].c) : null;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {/* Chart canvas */}
        <View style={{ width: chartW, height: CHART_H }} {...panResponder.panHandlers}>
          <Svg width={chartW} height={CHART_H}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={CHART_COLOR} stopOpacity="0.25" />
                <Stop offset="100%" stopColor={CHART_COLOR} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {yLabels.map((l, i) => (
              <Line key={i} x1={0} y1={l.y} x2={chartW} y2={l.y}
                stroke="#eeeeee" strokeWidth={1} />
            ))}

            {/* Prev close dashed */}
            {inRange(prevClose) && (
              <Line x1={0} y1={prevCloseY} x2={chartW} y2={prevCloseY}
                stroke="#999999" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.6} />
            )}

            {/* Area fill */}
            <Path d={area} fill="url(#grad)" />

            {/* Line */}
            <Path d={line} stroke={CHART_COLOR} strokeWidth={2.5} fill="none"
              strokeLinejoin="round" strokeLinecap="round" />

            {/* Scrubber */}
            {scrubX !== null && scrubY !== null && (
              <>
                <Line x1={scrubX} y1={0} x2={scrubX} y2={CHART_H}
                  stroke={CHART_COLOR} strokeWidth={1.5} strokeDasharray="4,3" />
                <Circle cx={scrubX} cy={scrubY} r={5} fill="#fff"
                  stroke={CHART_COLOR} strokeWidth={2} />
              </>
            )}
          </Svg>
        </View>

        {/* Y Axis */}
        <View style={{ width: AXIS_W, height: CHART_H, position: 'relative' }}>
          {yLabels.map((l, i) => (
            <Text key={i} style={[styles.yAxisText, { top: l.y - 8 }]}>
              {fmtPrice(l.price)}
            </Text>
          ))}
          {/* LTP blue outline box */}
          {inRange(ltp) && (
            <View style={[styles.ltpBox, { top: ltpY - 10, borderColor: CHART_COLOR }]}>
              <Text style={[styles.ltpBoxText, { color: CHART_COLOR }]}>{ltp.toFixed(2)}</Text>
            </View>
          )}
          {/* Prev close solid box */}
          {inRange(prevClose) && (
            <View style={[styles.prevCloseBox, { top: prevCloseY - 10 }]}>
              <Text style={styles.prevCloseBoxText}>{prevClose.toFixed(2)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* X Axis */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: 4, width: chartW }}>
        {xLabels.map((l, i) => (
          <Text key={i} style={styles.xAxisLabel}>{l.label}</Text>
        ))}
      </View>

      {/* Scrub tooltip */}
      {scrubX !== null && scrubPrice !== null && scrubY !== null && (
        <View style={[styles.scrubTooltip, {
          backgroundColor: CHART_COLOR,
          left: Math.min(chartW - 96, Math.max(4, (scrubX ?? 0) - 44)),
          top: Math.max(4, (scrubY ?? 0) - 40),
        }]}>
          <Text style={styles.scrubPrice}>₹{scrubPrice.toFixed(2)}</Text>
          <Text style={styles.scrubTime}>{scrubTime}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────
export default function HoldingsScreen() {
  const toastMainRef = React.useRef<any>(null);
  const toastSheetRef = React.useRef<any>(null);
  const toastChartRef = React.useRef<any>(null);
  const [activeTab, setActiveTab] = useState('Stocks');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [chartStock, setChartStock] = useState<any>(null);
  const [chartData, setChartData] = useState<{ c: number; time: string }[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRange, setChartRange] = useState('1Y');
  const [chartLayout, setChartLayout] = useState({ width: SCREEN_W, height: 320 });
  const insets = useSafeAreaInsets();
  const systemBottomInset = useSystemAndImeBottomInset();
  
              const rawHoldings = [
    { id: '1', name: 'RAJESHEXPO', qty: 50,  avg: 540.00,  ltp: 220.00,  prevClose: 215.00 },
    { id: '2', name: 'HDFCBANK',   qty: 80,  avg: 1450.00, ltp: 1125.00, prevClose: 1115.00 },
    { id: '3', name: 'SHRIRAMFIN', qty: 100, avg: 1160.00, ltp: 950.00,  prevClose: 938.00 },
  ];

  const holdings = useMemo(() => rawHoldings.map(item => {
    const invested = item.qty * item.avg;
    const current  = item.qty * item.ltp;
    const totalReturn = current - invested;
    const totalReturnPct = (totalReturn / invested) * 100;
    const todayReturn = (item.ltp - item.prevClose) * item.qty;
    const ltpChangePct = ((item.ltp - item.prevClose) / item.prevClose) * 100;
    const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return {
      ...item, invested, current, totalReturn, totalReturnPct, todayReturn,
      investedStr: fmt(invested), avgStr: fmt(item.avg), ltpStr: fmt(item.ltp),
      totalReturnStr: `${totalReturn >= 0 ? '+' : ''}${fmt(totalReturn)} (${totalReturnPct >= 0 ? '+' : ''}${totalReturnPct.toFixed(2)}%)`,
      returnColor: totalReturn >= 0 ? GREEN : RED,
      todayReturnStr: `${todayReturn >= 0 ? '+' : ''}${fmt(todayReturn)}`,
      todayReturnColor: todayReturn >= 0 ? GREEN : RED,
      ltpChangeStr: `${(item.ltp - item.prevClose) >= 0 ? '+' : ''}${(item.ltp - item.prevClose).toFixed(2)} (${ltpChangePct >= 0 ? '+' : ''}${ltpChangePct.toFixed(2)}%)`,
      ltpChangeColor: ltpChangePct >= 0 ? GREEN : RED,
    };
  }), []);

  const totalInvested  = useMemo(() => holdings.reduce((s, h) => s + h.invested, 0), [holdings]);
  const totalCurrent   = useMemo(() => holdings.reduce((s, h) => s + h.current,  0), [holdings]);
  const totalReturn    = totalCurrent - totalInvested;
  const totalReturnPct = (totalReturn / totalInvested) * 100;
  const totalToday     = holdings.reduce((s, h) => s + h.todayReturn, 0);
  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── Data fetch ────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (!chartStock) { setChartData([]); return; }
    setChartLoading(true);
    const cfg = RANGE_CFG[chartRange];

    if (chartStock.name === 'RAJESHEXPO') {
      const pts = cfg.points;
      const data = [];
      const now = new Date();
      const is1D = chartRange === '1D';
      
      let startPrice = 98;
      let midPrice = null;
      let midIndex = null;
      
      if (chartRange === '1Y') {
        startPrice = 540; 
        midPrice = 15; 
        midIndex = Math.floor(pts * 0.15); // Crash early
      } else if (chartRange === '3M') {
        startPrice = 15; 
      } else if (chartRange === '1M') {
        startPrice = 50; 
      } else if (chartRange === '1W') {
        startPrice = 80; 
      } else { 
        startPrice = chartStock.prevClose; 
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
               c = midPrice + recProg * (chartStock.ltp - midPrice);
            }
         } else {
            c = startPrice + progress * (chartStock.ltp - startPrice);
         }
         
         const vol = (chartRange === '1Y' || chartRange === '3M') ? 15 : (chartRange === '1M' ? 8 : 2);
         if (i > 0 && i < pts - 1) c += (Math.random() - 0.5) * vol;
         
         if (i === pts - 1) c = chartStock.ltp;
         
         let label = '';
         if (is1D) {
           const h = 9 + Math.floor(i / (pts/6.5)), m = Math.floor((i % (pts/6.5)) * (60/(pts/6.5)));
           label = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
         } else if (chartRange === '1Y') {
           // Force YTD labels (Jan to Sept)
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

    fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${chartStock.name}.NS?interval=${cfg.interval}&range=${cfg.range}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
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
        setChartData(genOffline(chartStock, cfg.points, chartRange));
        setChartLoading(false);
      });
  }, [chartStock, chartRange]);

  const modalIsPositive = chartData.length > 0 ? chartData[chartData.length - 1].c >= chartData[0].c : (chartStock ? chartStock.ltp >= chartStock.avg : true);
  const modalChartColor = modalIsPositive ? '#0B8062' : '#DA5329';


    const showMarketClosed = () => {
    const msg = `Market is currently closed.
Please trade between 9:15 AM - 3:30 PM`;
    toastMainRef.current?.show(msg);
    toastSheetRef.current?.show(msg);
    toastChartRef.current?.show(msg);
  };
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Holdings</Text>
        <TouchableOpacity><Ionicons name="search" size={22} color="#fff" /></TouchableOpacity>
      </View>

      {/* Indices */}
      <View style={styles.indicesBar}>
        <View style={styles.indexBox}>
          <Text style={styles.indexName}>NIFTY 50</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.indexPrice, { color: RED }]}>23,398.10</Text>
            <Text style={styles.indexChange}>-79.70 (-0.34%)</Text>
          </View>
        </View>
        <View style={styles.indexDivider} />
        <View style={styles.indexBox}>
          <Text style={styles.indexName}>SENSEX</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.indexPrice, { color: RED }]}>74,781.76</Text>
            <Text style={styles.indexChange}>-120.83 (-0.16%)</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.topTabs}>
        {[['Stocks', 'Stocks (3)'], ['MF', 'Mutual Funds']].map(([key, label]) => (
          <TouchableOpacity key={key} style={styles.topTab} onPress={() => setActiveTab(key)}>
            <Text style={[styles.topTabText, activeTab === key && styles.topTabTextActive]}>{label}</Text>
            {activeTab === key && <View style={styles.topTabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'MF' && (
          <View style={styles.emptyBox}>
            <Ionicons name="compass-outline" size={54} color="#ccc" />
            <Text style={styles.emptyTextTitle}>No positions yet.</Text>
            <Text style={styles.emptyTextSub}>You'll find your Mutual Fund positions here</Text>
            <TouchableOpacity style={styles.goBtn}>
              <Text style={styles.goBtnText}>Go to Explore</Text>
            </TouchableOpacity>
          </View>
        )}
        {activeTab === 'Stocks' && (
          <>
            <View style={styles.summaryBlock}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.sumLabel}>Invested</Text>
                  <Text style={styles.sumVal}>{fmt(totalInvested)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.sumLabel}>Current</Text>
                  <Text style={styles.sumVal}>{fmt(totalCurrent)}</Text>
                </View>
              </View>
              <View style={[styles.summaryRow, { marginTop: 16 }]}>
                <View>
                  <Text style={styles.sumLabel}>Total returns</Text>
                  <Text style={[styles.sumVal, { color: totalReturn >= 0 ? GREEN : RED }]}>
                    {totalReturn >= 0 ? '+' : ''}{fmt(totalReturn)} ({totalReturnPct.toFixed(2)}%)
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.sumLabel}>Today's returns</Text>
                  <Text style={[styles.sumVal, { color: totalToday >= 0 ? GREEN : RED }]}>
                    {totalToday >= 0 ? '+' : ''}{fmt(totalToday)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerThick} />

            {holdings.map(item => (
              <View key={item.id}>
                <TouchableOpacity style={styles.listItem} onPress={() => setSelectedStock(item)}>
                  <View style={[styles.listRow, { marginBottom: 4 }]}>
                    <Text style={styles.stockName}>{item.name}</Text>
                    <Text style={[styles.stockReturn, { color: item.returnColor }]}>{item.totalReturnStr}</Text>
                  </View>
                  <View style={[styles.listRow, { marginBottom: 2 }]}>
                    <Text style={styles.stockSub}>Invested {item.investedStr}</Text>
                    <Text style={styles.stockSub}>{item.avgStr} Avg.</Text>
                  </View>
                  <View style={styles.listRow}>
                    <Text style={styles.stockSub}>Qty. {item.qty}</Text>
                    <Text style={styles.stockSub}>
                      {item.ltpStr} <Text style={{ color: item.ltpChangeColor }}>{item.ltpChangeStr}</Text> LTP
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.dividerThin} />
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* ── Bottom Sheet Modal ── */}
      <Modal visible={!!selectedStock} transparent animationType="slide" statusBarTranslucent={true} onRequestClose={() => setSelectedStock(null)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPressOut={() => setSelectedStock(null)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <TouchableOpacity style={styles.dragHandleWrap} onPress={() => setSelectedStock(null)}>
                <View style={styles.dragHandle} />
              </TouchableOpacity>
              {selectedStock && (
                <>
                  <View style={styles.sheetHeaderRow}>
                    <View>
                      <Text style={styles.sheetStockName}>{selectedStock.name}</Text>
                      <Text style={styles.sheetTag}>NSE</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.sheetLtp, { color: selectedStock.ltpChangeColor }]}>{selectedStock.ltpStr}</Text>
                      <Text style={styles.sheetLtpChange}>{selectedStock.ltpChangeStr}</Text>
                    </View>
                  </View>
                  <View style={styles.metricsRow}>
                    <View><Text style={styles.sheetLabel}>Net qty</Text><Text style={[styles.sheetVal, { color: GREEN }]}>+{selectedStock.qty}</Text></View>
                    <View style={{ alignItems: 'center' }}><Text style={styles.sheetLabel}>Day's P&amp;L</Text><Text style={[styles.sheetVal, { color: selectedStock.todayReturnColor }]}>{selectedStock.todayReturnStr}</Text></View>
                    <View style={{ alignItems: 'flex-end' }}><Text style={styles.sheetLabel}>P&amp;L</Text><Text style={[styles.sheetVal, { color: selectedStock.returnColor }]}>{selectedStock.totalReturnStr}</Text></View>
                  </View>
                  <View style={styles.breakdownBox}>
                    {[
                      ['Avg. Price', selectedStock.avgStr],
                      ['Total invt.', selectedStock.investedStr],
                      ['Current val', fmt(selectedStock.current)],
                      ['Total qty.', String(selectedStock.qty)],
                    ].map(([l, v]) => (
                      <View key={l} style={styles.breakdownRow}>
                        <Text style={styles.bdLabel}>{l}</Text>
                        <Text style={styles.bdVal}>{v}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: GREEN }]} onPress={showMarketClosed}>
                      <Text style={styles.actionBtnText}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: RED }]} onPress={showMarketClosed}>
                      <Text style={styles.actionBtnText}>Sell</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.chartBtn}
                    onPress={() => { setChartRange('1D'); setChartStock(selectedStock); setSelectedStock(null); }}
                  >
                    <Ionicons name="analytics" size={16} color={TEXT_DARK} style={{ marginRight: 6 }} />
                    <Text style={styles.chartBtnText}>Open Charts</Text>
                  </TouchableOpacity>
                </>
              )}
              <View style={{ height: systemBottomInset + 24 }} />
            </View>
          </TouchableWithoutFeedback>
          <FastToast ref={toastSheetRef} bottomOffset={200} />
          </TouchableOpacity>
      </Modal>

      {/* ── Full Screen Chart Modal ── */}
      <Modal visible={!!chartStock} animationType="slide" statusBarTranslucent={true} onRequestClose={() => setChartStock(null)}>
        <View style={{ flex: 1, backgroundColor: '#ffffff', paddingTop: Math.max(insets.top, 40) }}>

          {chartStock && (
            <>
              <View style={styles.chartHeader}>
                <TouchableOpacity onPress={() => setChartStock(null)} style={{ padding: 8 }}>
                  <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.chartName}>{chartStock.name}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 2 }}>
                    <Text style={styles.chartTag}>NSE</Text>
                    <Text style={styles.chartTag}>BSE</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.sheetLtp, { color: chartStock.ltpChangeColor }]}>{chartStock.ltpStr}</Text>
                  <Text style={styles.sheetLtpChange}>{chartStock.ltpChangeStr}</Text>
                </View>
              </View>

              {/* Range Buttons */}
              <View style={styles.rangeBar}>
                {['1D', '1W', '1M', '3M', '1Y'].map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.rangeBtn, chartRange === r && { backgroundColor: modalChartColor }]}
                    onPress={() => setChartRange(r)}
                  >
                    <Text style={[styles.rangeBtnText, chartRange === r && styles.rangeBtnTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Chart */}
              <View
                style={styles.chartArea}
                onLayout={e => setChartLayout(e.nativeEvent.layout)}
              >
                {chartLoading ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={BLUE} />
                    <Text style={{ color: TEXT_GREY, marginTop: 12 }}>Loading chart...</Text>
                  </View>
                ) : chartData.length > 1 && chartLayout.width > 0 ? (
                  <StockChart
                    data={chartData}
                    width={chartLayout.width}
                    height={chartLayout.height}
                    prevClose={chartStock.prevClose}
                    ltp={chartStock.ltp}
                    avg={chartStock.avg}
                  />
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: TEXT_GREY }}>No data available</Text>
                  </View>
                )}
              </View>

              <View style={[styles.chartBottomBar, { paddingBottom: systemBottomInset + 12 }]}>
                <TouchableOpacity style={[styles.chartActionBtn, { backgroundColor: GREEN }]} onPress={showMarketClosed}>
                  <Text style={styles.actionBtnText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.chartActionBtn, { backgroundColor: RED }]} onPress={showMarketClosed}>
                  <Text style={styles.actionBtnText}>Sell</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <FastToast ref={toastChartRef} bottomOffset={80} />
          </View>
        </Modal>
        <FastToast ref={toastMainRef} bottomOffset={100} />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG_MAIN },

    holidayBanner: { backgroundColor: '#ffffff', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start' },
  holidayBannerText: { color: '#000', fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  knowMoreText: { color: '#000', fontSize: 13, fontFamily: 'Inter_700Bold', marginLeft: 10, marginTop: 2 },

  header: { backgroundColor: PURPLE, paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_500Medium' },

  indicesBar: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  indexBox: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indexName: { fontSize: 11, color: TEXT_DARK, fontFamily: 'Inter_600SemiBold' },
  indexPrice: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  indexChange: { fontSize: 11, color: TEXT_GREY, fontFamily: 'Inter_400Regular' },
  indexDivider: { width: 1, backgroundColor: '#eee', marginHorizontal: 12 },

  topTabs: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  topTab: { marginRight: 24, paddingVertical: 12, position: 'relative' },
  topTabText: { fontSize: 14, color: TEXT_GREY, fontFamily: 'Inter_600SemiBold' },
  topTabTextActive: { color: TEXT_DARK },
  topTabUnderline: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: TEXT_DARK },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTextTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#262626', marginTop: 16 },
  emptyTextSub: { fontSize: 14, color: '#666', marginTop: 6, fontFamily: 'Inter_400Regular' },
  goBtn: { marginTop: 24, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, borderWidth: 1, borderColor: '#aaa' },
  goBtnText: { color: '#262626', fontFamily: 'Inter_500Medium', fontSize: 14 },

  summaryBlock: { paddingHorizontal: 16, paddingVertical: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontSize: 11, color: TEXT_GREY, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  sumVal: { fontSize: 14, color: TEXT_DARK, fontFamily: 'Inter_500Medium' },

  dividerThick: { height: 8, backgroundColor: '#f4f4f4', borderTopWidth: 1, borderTopColor: '#e0e0e0', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  dividerThin: { height: 1, backgroundColor: BORDER, marginHorizontal: 16 },

  listItem: { paddingHorizontal: 16, paddingVertical: 12 },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockName: { fontSize: 14, fontFamily: 'Inter_500Medium', color: TEXT_DARK },
  stockReturn: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  stockSub: { fontSize: 11, color: TEXT_GREY, fontFamily: 'Inter_400Regular' },

  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingTop: 8, elevation: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  dragHandleWrap: { width: '100%', alignItems: 'center', paddingVertical: 8 },
  dragHandle: { width: 36, height: 4, backgroundColor: '#ccc', borderRadius: 2 },
  sheetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetStockName: { fontSize: 16, color: PURPLE, fontFamily: 'Inter_600SemiBold', textDecorationLine: 'underline', marginBottom: 4 },
  sheetTag: { fontSize: 10, color: TEXT_GREY, backgroundColor: BG_BOX, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  sheetLtp: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: TEXT_DARK },
  sheetLtpChange: { fontSize: 12, color: TEXT_GREY, fontFamily: 'Inter_400Regular' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sheetLabel: { fontSize: 11, color: TEXT_GREY, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  sheetVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  breakdownBox: { backgroundColor: BG_BOX, borderRadius: 8, padding: 12, marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  bdLabel: { fontSize: 12, color: TEXT_GREY, fontFamily: 'Inter_400Regular' },
  bdVal: { fontSize: 12, color: TEXT_DARK, fontFamily: 'Inter_600SemiBold' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  actionBtn: { flex: 1, height: 44, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  chartBtn: { flexDirection: 'row', height: 44, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  chartBtnText: { color: TEXT_DARK, fontSize: 14, fontFamily: 'Inter_500Medium' },

  chartHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  chartName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#111' },
  chartTag: { fontSize: 9, color: '#666', backgroundColor: '#f0f0f0', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, marginRight: 4, overflow: 'hidden' },

  rangeBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rangeBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  rangeBtnActive: { backgroundColor: '#0B8062' }, /* Default, overridden inline */
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
