import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { useBackButton } from '../common/BackButtonHandler';

import { TopNavigation, Button, TopNavigationAction, Icon, Layout, Text, Card, Input, Autocomplete, AutocompleteItem, Spinner, Divider, CheckBox } from '@ui-kitten/components';
import { Animated, Easing, Dimensions, StyleSheet, View, Image, FlatList, ScrollView , TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import Collapsible from 'react-native-collapsible';

import { IOScrollView } from 'react-native-intersection-observer'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import Header from '../layout/Header'
import ProductItem from './ProductItem'
import Cart from './Cart'

import { clearCategory, clearSeller, getAllProducts, getProducts, setCategory, setSeller, setKeywords, clearKeywords, getFilterDetails } from '../../actions/logistics';

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

  clearCategory, setCategory,
  clearSeller, setSeller,
  clearKeywords, setKeywords,

  navigation
}) => {
  const handleBackButtonClick = () => {
    if (cartActive || filterActive) {
      setCartActive(false)
      return true;
    } else {
      navigation.goBack()
      return true
    }
  }
  useBackButton(handleBackButtonClick)


  const [categoryToggled, setCategoryToggled] = useState(false);
  const [sellerToggled, setSellerToggled] = useState(false);
  
  const [searchValue, setSearchValue] = useState(null);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [filteredAutoComplete, setFilteredAutoComplete] = useState([]);

  const [activeFilterGroups, setActiveFilterGroups] = useState([]);

  const [cartActive, setCartActive] = useState(false)

  const [filterActive, setFilterActive] = useState(false)
  const [filterAnim, setFilterAnim] = useState(new Animated.Value(-Dimensions.get('window').width*.25))
  const [menuOverlayOpacity, setMenuOverlayAnim] = useState(new Animated.Value(1))
  const [menuOverlayWidth, setMenuOverlayWidth] = useState(new Animated.Value(-Dimensions.get('window').width))

  useEffect(() => {
    if (filterActive) {
      Animated.timing(
        filterAnim,
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
        filterAnim,
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
  }, [filterAnim, filterActive])

  const onSubmit = () => {
    setKeywords(search)
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
    getFilterDetails();
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
      {productsLoading && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      )}
      <Layout style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical:5, paddingTop: 15, paddingBottom: 15 }} level="1">
        <View style={{ justifyContent: 'center', paddingRight: 8 }}>
          <Ionicons name="funnel" size={25} color={'#ADADAD'} onPress={() => setFilterActive(true)}/>
        </View>
        <View style={{ width: (Dimensions.get('window').width*0.85) }}>
          <Autocomplete
            placeholder='Search for a Product'
            style={{ backgroundColor: '#ffffff' }}
            value={searchValue}
            onSelect={onSelect}
            onChangeText={onChangeText}>
            {filteredAutoComplete.length > 0 ? filteredAutoComplete.map(renderOption) : autoCompleteData.map(renderOption)}
          </Autocomplete>
          <Ionicons name="close-circle" size={22} color={'#ECECEC'} style={{ position: 'absolute', zIndex: 9, right: 5, top: 10 }} onPress={onClear}/>
        </View>
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

      <Animated.View style={[styles.overlay, { opacity: menuOverlayOpacity }, { left: menuOverlayWidth }]}>
        <TouchableWithoutFeedback onPress={() => setFilterActive(false)}>
          <View style={{ flex: 1, flexDirection: 'row' }}></View>
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View style={[styles.sideNav, { left: filterAnim }]}>
      {/* <Animated.View style={[styles.superModal, { top: modalAnim }]}> */}
        <TopNavigation
          accessoryLeft={() => <TopNavigationAction onPress={() => setFilterActive(false)} icon={props => <Icon {...props} name='arrow-back'/>}/>}
          title={`Product Filter`}
        />
        <ScrollView>
          {!filterDetailsLoading && (
            <View>
            {categoryGroups.map(categoryGroup => (
              <View key={categoryGroup.id} style={styles.collapsibleWrapper}>
                <TouchableHighlight onPress={() => activeFilterGroups.includes(categoryGroup.name) ? setActiveFilterGroups(activeFilterGroups.filter(item => item !== categoryGroup.name)) : setActiveFilterGroups([...activeFilterGroups, categoryGroup.name])}>
                  <View style={styles.collapsibleHeader}>
                    <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>{ categoryGroup.name }</Text>
                    <Ionicons name={true ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                  </View>
                </TouchableHighlight>
                <Collapsible collapsed={!activeFilterGroups.includes(categoryGroup.name)} duration={150} align="center">
                  <View style={styles.collapsibleContent}>
                  {categoryGroup.categories.map(category => (
                    <CheckBox
                      key={category.id}
                      style={{ marginBottom: 10 }}
                      checked={categoryFilter.includes(category.name) && true}
                      onChange={nextChecked => setCategory(category.name, nextChecked)}>
                      {evaProps => <Text {...evaProps} style={{ fontSize: 16, marginLeft: 15 }}>{category.name}</Text>}
                    </CheckBox>
                  ))}
                  </View>
                </Collapsible>
              </View>
            ))}
            </View>
          )}
          
          <View style={[styles.collapsibleWrapper, { paddingBottom: 100 }]}>
            <TouchableHighlight onPress={() => activeFilterGroups.includes('BRANDS') ? setActiveFilterGroups(activeFilterGroups.filter(item => item !== 'BRANDS')) : setActiveFilterGroups([...activeFilterGroups, 'BRANDS'])}>
              <View style={styles.collapsibleHeader}>
                <Text category="h6" style={{ fontFamily: 'Lato-Bold' }}>Brands</Text>
                <Ionicons name={true ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
              </View>
            </TouchableHighlight>
            <Collapsible collapsed={!activeFilterGroups.includes('BRANDS')} duration={150} align="center">
              <View style={styles.collapsibleContent}>
              {sellers.map(seller => (
                <CheckBox
                  key={seller.id}
                  style={{ marginBottom: 10 }}
                  checked={sellerFilter.includes(seller.name) && true}
                  onChange={nextChecked => setSeller(seller.name, nextChecked)}>
                  {evaProps => <Text {...evaProps} style={{ fontSize: 16, marginLeft: 15 }}>{seller.name}</Text>}
                </CheckBox>
              ))}
              </View>
            </Collapsible>
          </View>
        </ScrollView>
        <Button
          // style={[foodCardStyles.checkoutButton]}
          // style={{ marginBottom: 80, borderRadius: 0 }}
          // disabled={currentOrder.count < 1 || deliveryAddressId === '' || !delivery || !lastName || !firstName || !contact || !email ? true : false}
          // onPress={proceedToPayments}
        >
          CHECKOUT
        </Button>
        {/* {quantityLoading || currentOrderLoading || checkoutLoading || deleteLoading || siteInfoLoading || userLoading || loading ? (
          <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
            <Spinner size='large'/>
          </View>
        ): undefined} */}
      </Animated.View>
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
  setCategory: PropTypes.func.isRequired,
  setSeller: PropTypes.func.isRequired,
  setKeywords: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  products: state.products,
  logistics: state.logistics,
  auth: state.auth,
});

export default connect(mapStateToProps, { getFilterDetails, clearCategory, clearSeller, clearKeywords, getAllProducts, getProducts, setCategory, setSeller, setKeywords })(Products);