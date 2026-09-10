import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Reusable menu item component
const MenuItem = ({ icon, title, subtitle, badge }: any) => (
  <TouchableOpacity style={styles.menuItem}>
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        
        {/* Profile Header Section */}
        <TouchableOpacity style={styles.profileHeader}>
          <View style={styles.profileAvatarLarge}>
            <Text style={styles.profileAvatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileId}>UCC: 1A2B3C</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Funds Card Section */}
        <View style={styles.fundsSection}>
          <View style={styles.fundsHeaderRow}>
            <Text style={styles.fundsTitle}>Securities Wallet</Text>
            <TouchableOpacity>
              <Text style={styles.historyText}>History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Available to trade</Text>
            <Text style={styles.balance}>₹ 50,000.00</Text>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.row}>
              <Text style={styles.subLabel}>Used Margin</Text>
              <Text style={styles.subValue}>₹ 0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.subLabel}>Total Balance</Text>
              <Text style={styles.subValue}>₹ 50,000.00</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.withdrawBtn]}>
                <Text style={styles.withdrawBtnText}>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.addBtn]}>
                <Text style={styles.addBtnText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu Items Section */}
        <View style={styles.menuContainer}>
          <MenuItem icon="person-outline" title="My Account" subtitle="Profile, Bank Details, Segments" />
          <MenuItem icon="document-text-outline" title="Reports & Corporate Actions" subtitle="Ledger, P&L, Tax, Dividends" />
          <MenuItem icon="gift-outline" title="Refer & Earn" badge="Reward" />
          <MenuItem icon="settings-outline" title="Settings" subtitle="Dark mode, Notifications" />
          <MenuItem icon="help-buoy-outline" title="Help & Support" subtitle="FAQs, Raise a ticket" />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
    backgroundColor: '#f9f9f9',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  fundsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fundsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 14,
    color: '#666',
  },
  balance: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 13,
    color: '#666',
  },
  subValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
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
    fontWeight: '600',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#56328c',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
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
    color: '#1DB954',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E53935',
    marginLeft: 8,
  },
});
