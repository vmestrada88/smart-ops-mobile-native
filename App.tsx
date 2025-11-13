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
import AdminDashboard from './src/screens/AdminDashboard';
import UserDashboard from './src/screens/UserDashboard';
import ClientsScreen from './src/screens/ClientsScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import CreateInvoiceScreen from './src/screens/CreateInvoiceScreen';
import InvoiceListScreen from './src/screens/InvoiceListScreen';
import CreateProposalScreen from './src/screens/CreateProposalScreen';
import ProposalListScreen from './src/screens/ProposalListScreen';
import TechnicianScreen from './src/screens/TechnicianScreen';
import CustomHeader from './src/components/CustomHeader';

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
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboard}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Admin Dashboard" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="UserDashboard" 
            component={UserDashboard}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="User Dashboard" 
                backgroundColor="#3b82f6"
              />
            }}
          />
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
          <Stack.Screen 
            name="Clients" 
            component={ClientsScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Clients" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="ClientDetail" 
            component={ClientDetailScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Client Details" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="Inventory" 
            component={InventoryScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Inventory" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="Calendar" 
            component={CalendarScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Calendar" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="CreateInvoice" 
            component={CreateInvoiceScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Create Invoice" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="InvoiceList" 
            component={InvoiceListScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Invoice List" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="CreateProposal" 
            component={CreateProposalScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Create Proposal" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="ProposalList" 
            component={ProposalListScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Proposal List" 
                backgroundColor="#14b8a6"
              />
            }}
          />
          <Stack.Screen 
            name="Technician" 
            component={TechnicianScreen}
            options={{ 
              headerShown: true,
              header: () => <CustomHeader 
                title="Technician Management" 
                backgroundColor="#14b8a6"
              />
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;

