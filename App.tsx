/**
 * Smart Ops Mobile Native App
 * React Native CLI version
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerTintColor: '#14b8a6',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              title: 'Products',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;

