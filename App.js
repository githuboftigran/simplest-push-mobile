import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  StatusBar,
  AsyncStorage,
} from 'react-native';

import Login from './Login';
import Main from './Main';

import messaging from '@react-native-firebase/messaging';

const App = () => {

  const [messageText, setMessageText] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const handleSendPress = useCallback(async () => {
    const token = await messaging().getToken();
    if (token) {
      fetch(`http://192.168.1.6:3000/push-me-this?message=${messageText}&token=${token}`);
    } else {
      alert('Token is not ready yet');
    }
  }, [messageText]);

  const handleLogin = useCallback(() => setLoggedIn(true), []);
  const handleLogout = useCallback(() => setLoggedIn(false), []);

  useEffect(() => {
    AsyncStorage.getItem('sessionKey').then(sessionKey => setLoggedIn(!!sessionKey));
  }, []);

  const content = loggedIn ? <Main onLogout={handleLogout}/> : <Login onLogin={handleLogin}/>;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {content}
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
        />
        <Button title="Send" onPress={handleSendPress}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#555',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    marginVertical: 12,
    backgroundColor: 'white',
  },
});

export default App;
