import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ onLogout }) => {
  const [username, setUsername] = useState('');
  const [sessionKey, setSessionKey] = useState('');

  const handleLogoutPress = useCallback(async () => {
    const sessionKey = await AsyncStorage.getItem('sessionKey');
    if (!sessionKey) {
      alert('There is no session');
      return;
    }
    const response = await fetch(`http://192.168.1.6:3000/log-out?sessionKey=${sessionKey}`);
    const body = await response.json();
    if (!body.success) {
      alert('Session expired');
    }

    // Delete all the data and logout anyway
    await AsyncStorage.removeItem('sessionKey');
    await AsyncStorage.removeItem('username');
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    AsyncStorage.getItem('username').then(setUsername);
    AsyncStorage.getItem('sessionKey').then(setSessionKey);
  }, []);

  return (
    <View>
      <Text>{`Hello, ${username}! Your session key is: ${sessionKey}`}</Text>
      <Button title={'Log out'} onPress={handleLogoutPress}/>
    </View>
  );
};

export default Logout;
