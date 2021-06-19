import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { PROJECT_URL } from "../../actions/siteConfig"

import { Text, Button, Divider } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { InView } from 'react-native-intersection-observer'

import Collapsible from 'react-native-collapsible';

import { getOrders } from '../../actions/logistics';

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'
import { styles } from '../common/Styles'



const BookingItem = ({ ordersLoading, order, orders, index, getOrders, setOrder, setOrderModalActive, setOrderToDelete, setDeleteModalActive, navigation }) => {

  const lastProductElement = (inView) => {
    if (inView && orders.results.length == index+1 && orders.next !== null && !ordersLoading) {
      console.log('inview', index+1)
      getOrders({
        getMore: true
      });
    }
  }

  const deletePressed = () => {
    setOrderToDelete(order.id)
    setDeleteModalActive(true)
  }

  return (
    <InView onChange={inView => lastProductElement(inView)} style={styles.boxWithShadowContainer}>
      <View style={styles.boxWithShadow}>
        <View style={[styles.boxHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View style={{ paddingHorizontal: 15, flexDirection: 'row', backgroundColor: '#EEEEEE', borderRadius: 50, alignItems: 'center', height: 35 }}>
            <Text style={[{ fontFamily: 'Lato-Bold', marginRight: 5 }]}>RN</Text>
            <Text style={[{ color: '#03A9F4' }]}>#{order.ref_code}</Text>
          </View>
          {order.is_canceled ? (
            <Text style={[styles.mute, { fontFamily: 'Lato-Bold', alignSelf: 'center' }]}>Order Canceled</Text>
          ) : (
            order.is_delivered ? (
              !order.is_reviewed ? (
                <Button style={[{ backgroundColor: '#FFC107', borderColor: '#FFC107', borderRadius: 50, width: 100 }]} size='small' onPress={() => navigation.navigate('OrderReview', { orderId: order.id })}>REVIEW</Button>
              ) : (
                <Text style={[{ paddingHorizontal: 15, backgroundColor: '#EEEEEE', borderRadius: 50, textAlign: 'center', paddingVertical: 5 }]}>Reviewed</Text>
              )
            ) : (
              order.is_prepared ? (
                <Text style={[styles.mute, { fontFamily: 'Lato-Bold', alignSelf: 'center' }]}>Ready to Ship</Text>
              ) : (
                order.is_processed ? (
                  <Text style={[styles.mute, { fontFamily: 'Lato-Bold', alignSelf: 'center' }]}>Order Processed</Text>
                ) : (
                  <Text style={[styles.mute, { fontFamily: 'Lato-Bold', alignSelf: 'center' }]}>Processing</Text>
                )
              )
            )
          )}
        </View>
        <View style={styles.boxBody}>
          {order.order_items && (
            order.order_items.map((orderItem, index) => (
              <View key={orderItem.id} style={[styles.orderItem, {color: '#606060'}, index !== 0 ? {borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5} : {} ]}>
                <Image style={styles.orderItemImage} source={{ uri: `${PROJECT_URL}${orderItem.product_variant.thumbnail ? orderItem.product_variant.thumbnail : '/static/frontend/img/no-image.jpg'}`}}></Image>
                <View style={{ position: 'relative', flex: 1 }}>
                  <Text style={{ marginBottom: 5 }}>{orderItem.product.name} - {orderItem.product_variant.name}</Text>
                  {orderItem.is_delivered && (
                    orderItem.is_reviewed ? (
                      <Text style={{ paddingHorizontal:10, paddingVertical: 5, backgroundColor: '#EEEEEE', width: 100 }}>Reviewed</Text>
                    ) : (
                      <Button style={[{ backgroundColor: '#FFC107', borderColor: '#FFC107', width: 100, position: 'absolute', bottom: 0, right: 0, zIndex: 1 }]} size='small' onPress={() => navigation.navigate('ProductReview', { orderItemId: orderItem.id })}>REVIEW</Button>
                    )
                  )}
                  <Text style={{ fontSize: 12 }}>{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</Text>
                  <Text>₱ {orderItem.quantity*orderItem.ordered_price.toFixed(2)}</Text>
                </View>
              </View>
            ))
          )}
          <View>
            <Text style={styles.label}>Order Notes</Text>
            <Text style={[styles.inputSummary, {minHeight: 75}]}>{order.description}</Text>
          </View>
          
          <Divider/>
          <View style={{ paddingVertical: 5, marginTop: 10 }}>
            <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Pickup Address: </Text>
            <Text style={[styles.mute]}>{order.loc1_address}</Text>
          </View>
          <View style={{ paddingVertical: 5 }}>
            <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Delivery Address: </Text>
            <Text style={[styles.mute]}>{order.loc2_address}</Text>
          </View>
          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginBottom:5 }]}>Subtotal</Text>
              <Text>{order.promo_code && (order.promo_code.order_discount > 0 && <Text style={styles.strikethrough}>₱ {order.subtotal.toFixed(2)}</Text>)} ₱ {order.ordered_subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginBottom:5 }]}>Shipping</Text>
              <Text style={[styles.mute]}>{order.promo_code && (order.promo_code.delivery_discount > 0 && <Text style={styles.strikethrough}>₱ {order.initial_shipping.toFixed(2)}</Text>)} ₱ {order.shipping.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <Divider/>
        <View style={[styles.boxBody, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8F8F8', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
            <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginBottom:5, fontSize: 18 }]}>Total</Text>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 18 }}>₱ {order.total.toFixed(2)}</Text>
        </View>
      </View>
    </InView>
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const bookingItemStyles = StyleSheet.create({
})

BookingItem.propTypes = {
  getOrders: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrders })(BookingItem);