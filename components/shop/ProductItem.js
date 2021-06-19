import React, { useEffect, useCallback } from 'react';
import { Icon, Text, Card } from '@ui-kitten/components';
import { View, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'

import { PROJECT_URL } from '../../actions/siteConfig'

import { InView } from 'react-native-intersection-observer'

import { connect } from 'react-redux';
import { getProducts } from '../../actions/logistics';
import { styles } from '../common/Styles'


const ProductItem = ({ productsLoading, product, products, index, getProducts, navigation }) => {

  const CardHeader = ({ picture }) => (
    <View style={styles.shoppingCardHeader}>
      <Image style={styles.shoppingCardImage} source={{ uri: `${PROJECT_URL}${picture}` }} />
    </View>
  );

  const lastProductElement = (inView) => {
    if (inView && products.results.length == index+1 && products.next !== null && !productsLoading) {
      getProducts({
        getMore: true
      })
    }
  }

  // useEffect(() => {
  //   console.log(product.thumbnail)
  // }, [product]);

  
  return (
    <InView onChange={inView => lastProductElement(inView)}>
      <Card style={index % 2 === 0 ? styles.shoppingCardOdd : styles.shoppingCardEven}
        header={() => CardHeader({ picture: product.thumbnail })}
        onPress={() => navigation.navigate('ProductDetail', { selectedProduct: product.name, selectedSeller: product.seller.name })}
      >
        <Text style={{ fontFamily: 'Lato-Bold' }}>{product.name}</Text>
        <View style={{ alignItems: 'flex-start' }}>
          {product.review_count > 0 ? (
            <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row' }}>
              {[...Array(product.total_rating).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
              {[...Array(Math.max(5-parseInt(product.total_rating), 0)).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
            </View>
          ) : (
            <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e8e8e8', borderRadius: 4 }}>
              <Text  style={{ color: '#222222'}}>Unrated</Text>
            </View>
          )}
        </View>
      </Card>
    </InView>
  )
}


ProductItem.propTypes = {
  getProducts: PropTypes.func.isRequired,
}

export default connect(null, { getProducts })(ProductItem);