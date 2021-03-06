import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { PROJECT_URL } from "../actions/siteConfig"

import { createStackNavigator } from '@react-navigation/stack';

import { styles } from './common/Styles'

import { Menu, MenuGroup, MenuItem, IndexPath, Button, Modal, Card, Text, Divider } from '@ui-kitten/components';
import { BackHandler, Animated, Easing, Dimensions, View, Image, TouchableWithoutFeedback } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';

import { setMenuToggler } from '../actions/siteConfig';
import { useBackButton } from './common/BackButtonHandler';
import { reroute, logout } from '../actions/auth';

import Bookings from './accounts/Bookings'
import Products from './shop/Products'
import BottomTabs from './layout/BottomTabs'

const RootStack = createStackNavigator();

const Root = ({
  auth: {userLoading, isAuthenticated},
  siteConfig: {sideBarToggled},
  setMenuToggler,
  logout,
  reroute,
  navigation,
  route
}) => {
  
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(new IndexPath(0));

  const [menuActive, setMenuActive] = useState(false)
  const [menuAnim, setMenuAnim] = useState(new Animated.Value(-Dimensions.get('window').width*.25))
  const [menuOverlayOpacity, setMenuOverlayAnim] = useState(new Animated.Value(1))
  const [menuOverlayWidth, setMenuOverlayWidth] = useState(new Animated.Value(-Dimensions.get('window').width))


  const handleBackButtonClick = () => {
    if (menuActive) {
      setMenuActive(false)
      return true;
    } else {
      BackHandler.exitApp()
      return true;
    }
  }
  useBackButton(handleBackButtonClick)

  useEffect(() => {
    reroute({
      navigation,
      type: 'private',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  useEffect(() => {
    if (menuActive) {
      Animated.timing(
        menuAnim,
        {
          toValue: 0,
          duration: 300,
          easing: Easing.back(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayOpacity,
        {
          toValue: 0.5,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayWidth,
        {
          toValue: 0,
          duration: 0,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    } else {
      Animated.timing(
        menuAnim,
        {
          toValue: -Dimensions.get('window').width*.75,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayOpacity,
        {
          toValue: 0,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        menuOverlayWidth,
        {
          toValue: Dimensions.get('window').width,
          delay: 400,
          duration: 0,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    }
  }, [menuAnim, menuActive])


  useEffect(() => {
    setMenuToggler(false)
  }, []);

  useEffect(() => {
    setMenuActive(sideBarToggled)
  }, [sideBarToggled]);

  return (
    <>
      <Animated.View style={[styles.overlay, { opacity: menuOverlayOpacity }, { left: menuOverlayWidth }]}>
        <TouchableWithoutFeedback onPress={() => setMenuActive(false)}>
          <View style={{ flex: 1, flexDirection: 'row' }}></View>
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View style={[styles.sideNav, { left: menuAnim }]}>
        <>
          <View>
            <Image
              style={{
                height: 50,
                width: 65,
                alignSelf: 'center',
                marginTop: 30,
                marginBottom: 30,
              }}
              source={{uri:`${PROJECT_URL}/static/frontend/img/agrimart_logo_green.png`}}
            />
          </View>
          <Menu
            selectedIndex={new IndexPath(0)}
            onSelect={index => setSelectedMenuIndex(index)}>
            <MenuItem title='Home' accessoryLeft={() => <Ionicons size={22} name='home-outline'/>} onPress={() => setMenuActive(false)}/>
            <MenuItem title='My Bookings' accessoryLeft={() => <Ionicons size={22} name='cube-outline'/>} onPress={() => navigation.navigate('Bookings')}/>
            <Divider/>
            <MenuItem title='Account'/>
            <MenuItem title='My Profile' accessoryLeft={() => <Ionicons size={22} name='person-circle-outline'/>} onPress={() => navigation.navigate('Profile')}/>
            <MenuItem title='Security' accessoryLeft={() => <Ionicons size={22} name='shield-outline'/>} onPress={() => navigation.navigate('Security')}/>
            <MenuItem title='Logout' accessoryLeft={() => <Ionicons size={22} name='log-out-outline'/>} onPress={() => {logout()}}/>
          </Menu>
        </>
      </Animated.View>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Bookings" component={Bookings}/>
        <RootStack.Screen name="Products" component={Products}/>
      </RootStack.Navigator>
      <BottomTabs navigation={navigation} screen={route.params.screen}/>
    </>
  )
}

Root.protoTypes = {
  reroute: PropTypes.func.isRequired,
  setMenuToggler: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { reroute, setMenuToggler, logout })(Root);