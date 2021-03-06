import React, {useEffect} from 'react';
// import { View, Text, StyleSheet, FlatList, Alert } from 'react-native'
import { Dimensions, StyleSheet, ScrollView, View, Image, FlatList } from 'react-native'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text, Button, Card } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';

// import PropTypes from 'prop-types'


import {navigationRef} from './components/RootNavigation'

import Intro from './components/common/Intro'
import Login from './components/accounts/Login'
import Signup from './components/accounts/Signup'
import ConfirmEmail from './components/accounts/ConfirmEmail'
import PasswordReset from './components/accounts/PasswordReset'
import Security from './components/accounts/Security'

import Profile from './components/accounts/Profile'
// import Bookings from './components/accounts/Bookings'
// import OrderReview from './components/accounts/review/OrderReview'
// import ProductReview from './components/accounts/review/ProductReview'

import Root from './components/RootStackScreen'

// import SellerDetail from './components/shop/SellerDetail'
import ProductDetail from './components/shop/ProductDetail'
import Payment from './components/shop/Payment'

// import DeliveryPayment from './components/delivery/DeliveryPayment'

import { loadUser } from './actions/auth'
import { loadSite } from './actions/siteConfig'

const Stack = createStackNavigator();


  
const linking = {
  prefixes: ['https://www.quezonagrimart.com.ph', 'agrimart://'],
  config: {
    screens: {
      Intro: 'activated/:uidb64',
      Login: 'login',
      Bookings: 'bookings',
    },
  }
};

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadSite());
  });

  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}} customMapping={mapping}>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
            <Stack.Screen
              name="Intro"
              component={Intro}
            />
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
            />
            <Stack.Screen
              name="ConfirmEmail"
              component={ConfirmEmail}
            />
            <Stack.Screen
              name="PasswordReset"
              component={PasswordReset}
            />
            <Stack.Screen
              name="Security"
              component={Security}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
            />
            {/* <Stack.Screen
              name="Bookings"
              component={Bookings}
            /> */}
            {/* <Stack.Screen
              name="OrderReview"
              component={OrderReview}
              options={{orderId: null}}
            />
            <Stack.Screen
              name="ProductReview"
              component={ProductReview}
              options={{orderItemId: null}}
            /> */}
            <Stack.Screen
              name="Root"
              component={Root}
            />
            {/* <Stack.Screen
              name="SellerDetail"
              component={SellerDetail}
              options={{selectedSeller: 'selectedSeller'}}
            /> */}
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={{selectedSeller: 'selectedSeller', selectedProduct: 'selectedProduct'}}
            />
            <Stack.Screen
              name="Payment"
              component={Payment}
              options={{selectedSeller: 'selectedSeller'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App;