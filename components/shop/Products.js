import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { useBackButton } from '../common/BackButtonHandler';

import { Icon, Layout, Text, Card, Autocomplete, AutocompleteItem, Spinner, Divider } from '@ui-kitten/components';
import { Dimensions, StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native'

import { IOScrollView } from 'react-native-intersection-observer'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import Header from '../layout/Header'
import ProductItem from './ProductItem'
import Cart from './Cart'

import { clearCategory, clearSeller, updateQuery, getAllProducts, getProducts, setCategory, setSeller, setKeywords, clearKeywords, getFilterDetails } from '../../actions/logistics';

const Products = ({
  auth: { isAuthenticated, user },
  logistics: {
    currentOrderLoading,
    currentOrder,

    filterDetailsLoading,
    categoryGroups, sellers,

    allProducts, allProductsLoading,
    productsLoading, moreProductsLoading,
    products,

    categoryFilter, sellerFilter, keywordsFilter
  },
  getAllProducts, getProducts, getFilterDetails, 

  updateQuery,
  clearCategory, setCategory,
  clearSeller, setSeller,
  clearKeywords, setKeywords,

  navigation
}) => {


  const [categoryToggled, setCategoryToggled] = useState(false);
  const [sellerToggled, setSellerToggled] = useState(false);
  
  const [searchValue, setSearchValue] = useState(null);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [filteredAutoComplete, setFilteredAutoComplete] = useState([]);

  const [cartActive, setCartActive] = useState(false)

  const handleBackButtonClick = () => {
    if (cartActive) {
      setCartActive(false)
      return true;
    } else {
      navigation.goBack()
      return true
    }
  }
  useBackButton(handleBackButtonClick)

  const onSubmit = () => {
    setKeywords(search),
    updateQuery(history);
  }

  const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());
  
  const onSelect = (index) => {
    if(filteredAutoComplete.length > 0) {
      setSearchValue(filteredAutoComplete[index].title);
      setKeywords(filteredAutoComplete[index].title)
    } else {
      setSearchValue(autoCompleteData[index].title);
      setKeywords(autoCompleteData[index].title)
    }
  };

  const onClear = (index) => {
    setSearchValue('');
    setKeywords('')
  };

  const onChangeText = (query) => {
    setSearchValue(query);
    setFilteredAutoComplete(autoCompleteData.filter(item => filter(item, query)));
  };

  const renderOption = (item, index) => (
    <AutocompleteItem
      key={index}
      title={item.title}
    />
  );
  
  useEffect(() => {
    if (!allProductsLoading) {
      const data = []
      allProducts.forEach(product => {
        data.push({title: product.name})
      })
      setAutoCompleteData(data)
    }
    return () => {
      if (!allProductsLoading) {
        const data = []
        allProducts.forEach(product => {
          data.push({title: product.name})
        })
        setAutoCompleteData(data)
      }
    }
  }, [allProductsLoading]);
  
  useEffect(() => {
    getAllProducts()
  }, []);

  useEffect(() => {
    getProducts({ getMore: false });
  }, [categoryFilter, sellerFilter, keywordsFilter]);
  
  useEffect(() => {
    if (products) {
      products.results.forEach(item => {
      })
    }
  }, [products]);

  const placeholderRange = [...Array(4).keys()];
  const productRange = [...Array(8).keys()];

  return (
    <>
      <Header subtitle='Products' sideMenu={true}/>
      <Layout style={{ paddingHorizontal: 10, paddingVertical:5, paddingTop: 15 }} level="1">
        <Autocomplete
          placeholder='Search for a Product'
          style={{ backgroundColor: '#ffffff' }}
          value={searchValue}
          onSelect={onSelect}
          onChangeText={onChangeText}>
          {filteredAutoComplete.length > 0 ? filteredAutoComplete.map(renderOption) : autoCompleteData.map(renderOption)}
        </Autocomplete>
        <Ionicons name="close-circle" size={22} color={'#ECECEC'} style={{ position: 'absolute', zIndex: 9, right: 16, top: 22 }} onPress={onClear}/>
      </Layout>
      <Divider/>
      <Layout style={styles.shoppingCardsWrapper} level="2">
        {products ? (
          <IOScrollView contentContainerStyle={styles.shoppingCardsContainer}>
            {products.results.map((item, index) => (
              <ProductItem key={item.id} product={item} products={products} index={index} productsLoading={productsLoading} navigation={navigation}/>
            ))}
            {moreProductsLoading ? (
              <Layout level="2" style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                <Spinner size='medium'></Spinner>
              </Layout>
            ) : undefined}
          </IOScrollView>
        ) : (
          <FlatList
            style={styles.shoppingCardsContainer}
            numColumns={2}
            data={productRange}
            renderItem={({range, index}) => (
              <TouchableOpacity>
                <Card style={index % 2 === 0 ? styles.shoppingCardOdd : styles.shoppingCardEven}>
                  <Text style={{ fontSize: 16, fontWeight: '700', minHeight: 200 }}></Text>
                  <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row' }}>
                    {[...Array(0).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
                  </View>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </Layout>
      {isAuthenticated && !currentOrderLoading && currentOrder !== null && currentOrder.order_items.length > 0 ? (
        <Ionicons style={styles.foodCartButton} name="cart" size={28} color={"#ffffff"} onPress={() => setCartActive(!cartActive)}/>
      ) : undefined}
      
      <Cart cartActive={cartActive} setCartActive={setCartActive} navigation={navigation}/>
    </>
  )
}


let deviceWidth = Dimensions.get('window').width

const foodStyles = StyleSheet.create({
  listSliderWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  categoryCard: {
    alignItems:'center',
    // borderTopWidth: 0,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    // borderLeftWidth: 0,
    margin: 5,
    width: (deviceWidth/4)-20,
    height: 110,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryContent: {
    width: (deviceWidth/4)-20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    borderRadius: 100,
    width: (deviceWidth/4)-35,
    height: (deviceWidth/4)-35
  },
  sliderText: {
    marginTop: 5,
    color: '#222'
  },
})

Products.propTypes = {
  getAllProducts: PropTypes.func.isRequired,
  getFilterDetails: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,

  clearCategory: PropTypes.func.isRequired,
  clearSeller: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setSeller: PropTypes.func.isRequired,
  setKeywords: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  products: state.products,
  logistics: state.logistics,
  auth: state.auth,
});

export default connect(mapStateToProps, { getFilterDetails, clearCategory, clearSeller, clearKeywords, updateQuery, getAllProducts, getProducts, setCategory, setSeller, setKeywords })(Products);