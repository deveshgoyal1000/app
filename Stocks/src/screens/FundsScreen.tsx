import React from 'react';
import FastToast from '../components/FastToast';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ToastAndroid, Alert } from 'react-native';

const PURPLE = '#5B2D8E';

// Reusable menu item component
const MenuItem = ({ icon, title, subtitle, badge, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={22} color="#56328c" style={styles.menuIcon} />
      <View>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.menuItemRight}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </View>
  </TouchableOpacity>
);



export default function FundsScreen() {
  const fastToastRef = React.useRef<any>(null);

  const showMarketClosed = () => {
    fastToastRef.current?.show(`Market is currently closed.\nPlease trade between 9:15 AM - 3:30 PM`);
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
      
      {/* Purple Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={showMarketClosed}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

            
      <ScrollView style={styles.container}>
        
        {/* Profile Header Section */}
        <TouchableOpacity style={styles.profileHeader} onPress={showMarketClosed}>
          <View style={styles.profileAvatarLarge}>
            <Text style={styles.profileAvatarText}>PK</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Pulkit kumar</Text>
            <Text style={styles.profileId}>UCC: 1AJUEWDY7H</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Funds Card Section */}
        <View style={styles.fundsSection}>
          <View style={styles.fundsHeaderRow}>
            <Text style={styles.fundsTitle}>Securities Wallet</Text>
            <TouchableOpacity onPress={showMarketClosed}>
              <Text style={styles.historyText}>History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Available to trade</Text>
            <Text style={styles.balance}>₹ 0.00</Text>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.row}>
              <Text style={styles.subLabel}>Used Margin</Text>
              <Text style={styles.subValue}>₹ 0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.subLabel}>Total Balance</Text>
              <Text style={styles.subValue}>₹ 0.00</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.withdrawBtn]} onPress={showMarketClosed}>
                <Text style={styles.withdrawBtnText}>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.addBtn]} onPress={showMarketClosed}>
                <Text style={styles.addBtnText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu Items Section */}
        <View style={styles.menuContainer}>
          <MenuItem icon="person-outline" title="My Account" subtitle="Profile, Bank Details, Segments" onPress={showMarketClosed} />
          <MenuItem icon="document-text-outline" title="Reports & Corporate Actions" subtitle="Ledger, P&L, Tax, Dividends" onPress={showMarketClosed} />
          <MenuItem icon="gift-outline" title="Refer & Earn" badge="Reward" onPress={showMarketClosed} />
          <MenuItem icon="settings-outline" title="Settings" subtitle="Dark mode, Notifications" onPress={showMarketClosed} />
          <MenuItem icon="help-buoy-outline" title="Help & Support" subtitle="FAQs, Raise a ticket" onPress={showMarketClosed} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#DA5329" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
      <FastToast ref={fastToastRef} bottomOffset={100} />
    </View>
  );
}

const styles = StyleSheet.create({
    holidayBanner: { backgroundColor: '#ffffff', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start' },
  holidayBannerText: { color: '#000', fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  knowMoreText: { color: '#000', fontSize: 13, fontFamily: 'Inter_700Bold', marginLeft: 10, marginTop: 2 },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: PURPLE,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_500Medium' },
  iconBtn: { marginLeft: 16 },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#56328c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#262626',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  fundsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fundsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundsTitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#262626',
  },
  historyText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#56328c',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  balance: {
    fontSize: 24,
    fontFamily: 'Inter_500Medium',
    color: '#262626',
    marginVertical: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  subValue: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#262626',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  withdrawBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#56328c',
  },
  withdrawBtnText: {
    color: '#56328c',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  addBtn: {
    backgroundColor: '#56328c',
  },
  addBtnText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  menuContainer: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#262626',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#0B8062',
    fontFamily: 'Inter_500Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#DA5329',
    marginLeft: 8,
  },
});
















