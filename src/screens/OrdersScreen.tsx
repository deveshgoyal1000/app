import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={64} color="#ddd" />
      <Text style={styles.title}>No active orders</Text>
      <Text style={styles.subtitle}>Place an order from the Watchlist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
});
