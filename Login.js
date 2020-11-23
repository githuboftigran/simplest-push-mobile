import React, { useState, useCallback } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const handleLoginPress = useCallback(async () => {
    const response = await fetch(`http://192.168.1.6:3000/log-in?username=${username}&password=UNUSED_PASSWORD`);
    const body = await response.json();
    console.log(body);
    if (body.success) {
      const { data: { name, sessionKey } } = body;
      await AsyncStorage.setItem('sessionKey', String(sessionKey));
      await AsyncStorage.setItem('username', name);
      onLogin();
    } else {
      alert(`Username ${username} was not found`);
    }
  }, [username, onLogin]);
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput style={styles.input} placeholder="Password"/>
      <Button title={'Log in'} onPress={handleLoginPress}/>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    marginVertical: 12,
    backgroundColor: 'white',
  },
});
