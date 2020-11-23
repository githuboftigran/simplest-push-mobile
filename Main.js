import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, AsyncStorage, Text } from 'react-native';

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
    if (body.success) {
      await AsyncStorage.removeItem('sessionKey');
      await AsyncStorage.removeItem('username');
      onLogout();
    } else {
      alert('Session expired');
    }
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
