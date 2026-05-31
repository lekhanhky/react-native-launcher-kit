/** Full-screen loading indicator shown while app data is being fetched. */
import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const Loading: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#6C3FBF" />
    <Text style={styles.text}>Loading apps...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
  },
  text: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 15,
  },
});

export default Loading;
