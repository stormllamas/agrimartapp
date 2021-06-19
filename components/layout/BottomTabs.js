import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';

import { View, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import { BottomNavigation, BottomNavigationTab, Layout } from '@ui-kitten/components';

const BottomTabs = ({
  auth: {current, all_subjects},
  navigation,
  screen
}) => {

  const [selectedIndex, setSelectedIndex] = useState(1);

  const onTabSelect = index => {
    console.log(index)
    setSelectedIndex(index)
    if (index == 0) {
      navigation.navigate('Bookings')
    } else if (index == 1) {
      navigation.navigate('Root', { screen: 'Products'})
    } else if (index == 2) {
      navigation.navigate('Profile')
    }
  }

  useEffect(() => {
    if (screen == 'Bookings') {
      setSelectedIndex(0)
    } else if (screen == 'Products') {
      setSelectedIndex(1)
    }
  }, [screen]);

  return (
    <Layout>
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={index => onTabSelect(index)}>
        <BottomNavigationTab icon={props => <FontAwesome name="book" size={20} color={selectedIndex == 0 ? "#689F38":"#909CB4"}/>} title='BOOKINGS'/>
        <BottomNavigationTab icon={props => <FontAwesome name="search" size={20} color={selectedIndex == 1 ? "#689F38":"#909CB4"}/>} title='SEARCH'/>
        <BottomNavigationTab icon={props => <FontAwesome name="user" size={20} color={selectedIndex == 2 ? "#689F38":"#909CB4"}/>} title='PROFILE'/>
      </BottomNavigation>
    </Layout>
  )
}


const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(BottomTabs);