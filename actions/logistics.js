import axios from 'axios';
import { Alert } from 'react-native'

import { PROJECT_URL } from './siteConfig'

import {
  GET_HIGHLIGHTS,
  
  GET_FILTER_DETAILS,

  SELLER_LOADING, 
  GET_SELLER, SELLER_ERROR,

  SELLER_PRODUCTS_LOADING, 
  GET_SELLER_PRODUCTS,
  SELLER_PRODUCTS_ERROR,
  MORE_SELLER_PRODUCTS_LOADING,
  GET_MORE_SELLER_PRODUCTS,
  SELLER_PRODUCTS_PAGE,
  
  ALL_PRODUCTS_LOADING, GET_ALL_PRODUCTS, ALL_PRODUCTS_ERROR,
  PRODUCTS_LOADING,
  GET_PRODUCTS,
  PRODUCTS_ERROR,
  MORE_PRODUCTS_LOADING,
  GET_MORE_PRODUCTS,
  PRODUCTS_PAGE,
  
  PRODUCT_LOADING,
  GET_PRODUCT, PRODUCT_ERROR,

  FILTER_KEYWORDS, CLEAR_KEYWORDS,
  FILTER_CATEGORY, REMOVE_CATEGORY, CLEAR_CATEGORY,
  FILTER_SELLER, REMOVE_SELLER, CLEAR_SELLER,

  CURRENT_ORDER_LOADING, GET_CURRENT_ORDER,
  CURRENT_ORDER_ERROR,

  ORDERS_LOADING, MORE_ORDERS_LOADING,
  GET_ORDERS, ORDERS_ERROR,
  GET_MORE_ORDERS, SET_ORDERS_PAGE,
  FILTER_CURRENT_ONLY,

  ORDER_LOADING,
  GET_ORDER,
  ORDER_ERROR,
  REVIEW_ORDER,

  ORDER_ITEM_LOADING, GET_ORDER_ITEM,
  ORDER_ITEM_ERROR,
  REVIEW_PRODUCT,
  REVIEW_PRODUCT_ORDER,

  QUANTITY_LOADING,
  QUANTITY_CHANGED,
  QUANTITY_CHANGE_ERROR,
  
  DELETE_LOADING,
  DELETE_ORDER_ITEM,
  DELETE_ERROR,

  CHECKOUT_LOADING,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILED,

  COMPLETE_ORDER_LOADING,
  COMPLETE_ORDER_SUCCESS,
  COMPLETE_ORDER_FAILED,

  FAVORITES_LOADING, GET_FAVORITES, DELETE_FAVORITE,
  USER_UPDATED,

  SYNC_ORDER,
  
  AUTH_ERROR,
} from './types'

import { tokenConfig } from '../actions/auth';

// PRODUCTS
export const getFilterDetails = () => async dispatch => {
  const res = await axios.get(`${PROJECT_URL}/api/filter_details`)

  dispatch({
    type: GET_FILTER_DETAILS,
    payload: res.data,
  });
}

export const getAllProducts = () => async (dispatch, getState) => {
  try {
    await dispatch({ type: ALL_PRODUCTS_LOADING });
    const res = await axios.get(`${PROJECT_URL}/api/all_products/`)
    dispatch({
      type: GET_ALL_PRODUCTS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: ALL_PRODUCTS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const getProducts = ({ getMore }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      dispatch({ type: PRODUCTS_LOADING })
      const { categoryQuery, brandQuery, keywordsQuery } = setQueries(getState)
      const res = await axios.get(`${PROJECT_URL}/api/products?${categoryQuery}${brandQuery}${keywordsQuery}`)
      // const res = await axios.get(`${PROJECT_URL}/api/products?`)
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
    } else {
      dispatch({ type: MORE_PRODUCTS_LOADING })
      const { categoryQuery, brandQuery, keywordsQuery } = setQueries(getState)
      const { productsPage } = getState().logistics;
    
      dispatch(setProductsPage(parseInt(productsPage) + 1));
      const res = await axios.get(`${PROJECT_URL}/api/products?page=${getState().logistics.productsPage}${keywordsQuery}${categoryQuery}${brandQuery}`)
      // const res = await axios.get(`${PROJECT_URL}/api/products?page=${getState().logistics.productsPage}`)
      dispatch({
        type: GET_MORE_PRODUCTS,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({ type: PRODUCTS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
const setQueries = (getState) => {
  let categoryQuery = '', brandQuery = '', keywordsQuery = ''
  const { productsPage, categoryFilter, sellerFilter, keywordsFilter } = getState().logistics;
  
  // Set Queries
  categoryFilter.length > 0 && categoryFilter.sort().forEach(c => categoryQuery += `&category=${c}`)
  sellerFilter.length > 0 && sellerFilter.sort().forEach(s => brandQuery += `&brand=${s}`)
  if (keywordsFilter) keywordsQuery = `&keywords=${keywordsFilter}`

  return {categoryQuery, brandQuery, keywordsQuery}
}
export const clearCategory = () => {return { type: CLEAR_CATEGORY }}
export const clearSeller = () => {return { type: CLEAR_SELLER }}
export const clearKeywords = () => {return { type: CLEAR_KEYWORDS }}
export const setProductsPage = page => {
  return {
    type: PRODUCTS_PAGE,
    payload: page
  }
}
export const setCategory = ( category, value ) => async dispatch => {
  dispatch({
    type: value ? FILTER_CATEGORY : REMOVE_CATEGORY,
    payload: category,
  })
}
export const setSeller = (seller, value) => async dispatch => {
  dispatch({
    type: value === true ? FILTER_SELLER : REMOVE_SELLER,
    payload: seller,
  })
}
export const setKeywords = text => async dispatch => {
  dispatch({
    type: FILTER_KEYWORDS,
    payload: text,
  })
}
export const updateQuery = history => async (dispatch, getState) => {
  let categoryPath = '', brandPath = '', keywordsPath = ''
  const { categoryFilter, sellerFilter, keywordsFilter } = getState().logistics;

  // Set Paths
  if (categoryFilter.length > 0) categoryFilter.sort().forEach((c,i) => i === 0 ? categoryPath += `&category=${c.replaceAll(' ', '-')}` : categoryPath += `--${c.replaceAll(' ', '-')}`)
  if (sellerFilter.length > 0) sellerFilter.sort().forEach((c,i) => i === 0 ? brandPath += `&brand=${c.replaceAll(' ', '-')}` : brandPath += `--${c.replaceAll(' ', '-')}`)
  if (keywordsFilter) keywordsPath = `&keywords=${keywordsFilter.replaceAll(' ', '-')}`

  history.push({ search: `?${keywordsPath}${categoryPath}${brandPath}`})
}

// CURRENT ORDER
export const getCurrentOrder = ({ query, updateOnly }) => async (dispatch, getState) => {
  !updateOnly && dispatch({ type: CURRENT_ORDER_LOADING });
  try {
    const res = await axios.get(`${PROJECT_URL}/api/current_order/?${query ? query : ''}`, tokenConfig(getState))
    dispatch({
      type: GET_CURRENT_ORDER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: CURRENT_ORDER_ERROR });
    dispatch({ type: AUTH_ERROR });
  }
}


// ORDER ITEMS
export const addOrderItem = ({ productId }) => async (dispatch, getState) => {
  const body = {
    order: getState().logistics.currentOrder.id,
    product_variant: productId
  }
  try {
    const res = await axios.post(`${PROJECT_URL}/api/order_item/`, body, tokenConfig(getState))
    await dispatch(getCurrentOrder({
      updateOnly: true
    }));
  } catch (err) {
    console.log(err)
  }
}
export const deleteOrderItem = ({ id }) => async (dispatch, getState) => {
  dispatch({ type: DELETE_LOADING });
  try {
    await axios.delete(`${PROJECT_URL}/api/order_item/${id}/`, tokenConfig(getState))
    await dispatch(getCurrentOrder({ updateOnly: true }));
    dispatch({
      type: DELETE_ORDER_ITEM,
      payload: id
    })
  } catch (err) {
    dispatch({ type: DELETE_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const changeQuantity = ({ orderItemID, operation }) => async (dispatch, getState) => {
  dispatch({ type: QUANTITY_LOADING })  
  try {
    const res = await axios.put(`${PROJECT_URL}/api/change_quantity/${orderItemID}/${operation}/`, null, tokenConfig(getState))
    if (res.data.status === 'okay') {
      dispatch({ type: QUANTITY_CHANGED })
      dispatch(getCurrentOrder({updateOnly:true}))
    } else {
      dispatch({ type: QUANTITY_CHANGE_ERROR })
      Alert.alert(
        "Error",
        res.data.msg,
        [
          { text: "OK" }
        ]
      );
    }
  } catch (err) {
    console.log('changeQuantity', err)
    dispatch({ type: AUTH_ERROR })
    dispatch({ type: QUANTITY_CHANGE_ERROR })
  }
}

// SHOP
export const checkout = ({ formData, navigation }) => async (dispatch, getState) => {
  // dispatch({ type: CHECKOUT_LOADING })
  console.log(formData)
  try {
    const orderBody = {
      user: getState().auth.user.id,
  
      first_name: formData.firstName,
      last_name: formData.lastName,
      contact: formData.contact,
      email: formData.email,
      gender: formData.gender,
  
      loc1_latitude: parseFloat(formData.pickupLat),
      loc1_longitude: parseFloat(formData.pickupLng),
      loc1_address: formData.pickupAddress,
      loc2_latitude: parseFloat(formData.deliveryLat),
      loc2_longitude: parseFloat(formData.deliveryLng),
      loc2_address: formData.deliveryAddress,
      distance_text: formData.distanceText,
      distance_value: formData.distanceValue,
      duration_text: formData.durationText,
      duration_value: formData.durationValue,

      promo_code: formData.promoCode
    }
    const res = await axios.put(`${PROJECT_URL}/api/checkout/`, orderBody, tokenConfig(getState))
    if (res.data.status === "okay") {
      dispatch({ type: CHECKOUT_SUCCESS })
      navigation.navigate('Payment')
    } else {
      dispatch({ type: CHECKOUT_FAILED })
      Alert.alert(
        "Error",
        res.data.msg,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      dispatch(getCurrentOrder({updateOnly: true}))
    }
  } catch (err) {
    console.log(err)
  }
}

export const getProduct = ({ productQuery, sellerQuery }) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_LOADING });
    const res = await axios.get(`${PROJECT_URL}/api/product/${productQuery}/${sellerQuery}/`)
    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: PRODUCT_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}

export const proceedWithCOD = ({ navigation, socket }) => async (dispatch, getState) => {
  // dispatch({ type: COMPLETE_ORDER_LOADING });

  try {
    const res = await axios.get(`${PROJECT_URL}/api/current_order/?for_checkout=true`, tokenConfig(getState))
    if (res.data.has_valid_item === true) {
      await axios.put(`${PROJECT_URL}/api/complete_order/1/`, null, tokenConfig(getState))
      dispatch({ type: COMPLETE_ORDER_SUCCESS });
      Alert.alert(
        "Success",
        "Order Booked!",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      navigation.navigate('Bookings')
      await axios.post(`${PROJECT_URL}/api/new_order_update/`, { 'ref_code': res.data.ref_code }, tokenConfig(getState))
    } else {
      dispatch({ type: COMPLETE_ORDER_FAILED });
      Alert.alert(
        "Error",
        res.data.msg,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      navigation.navigate('Bookings')
    }
  } catch (err) {
    console.log(err)
    dispatch({ type: COMPLETE_ORDER_FAILED });
    Alert.alert(
      "Error",
      "Something went wrong. Please try again",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK" }
      ]
    );
  }
}

export const setCurrentOnly = ({ bool }) => async (dispatch, getState) => {
  dispatch({
    type: FILTER_CURRENT_ONLY,
    payload: bool
  })
}

export const getOrders = ({ getMore }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      dispatch({ type: ORDERS_LOADING });
      const { ordersCurrentPage, currentOnly } = getState().logistics;
      const ordersQuery = `page=${ordersCurrentPage}`
      console.log(`${PROJECT_URL}/api/orders/?${ordersQuery}${currentOnly ? `&delivered=false`: ''}`)
      const orders = await axios.get(`${PROJECT_URL}/api/orders/?${ordersQuery}${currentOnly ? `&delivered=false`: ''}`, tokenConfig(getState))
      dispatch({
        type: GET_ORDERS,
        payload: orders.data,
      })
    } else {
      dispatch({ type: MORE_ORDERS_LOADING });
      await dispatch({
        type: SET_ORDERS_PAGE,
        payload: getState().logistics.ordersCurrentPage + 1,
      })
      const { ordersCurrentPage, currentOnly } = getState().logistics;
      const ordersQuery = `?page=${ordersCurrentPage}`
      console.log(`${PROJECT_URL}/api/orders/${ordersQuery}${currentOnly ? `&delivered=false`: ''}`)
      const orders = await axios.get(`${PROJECT_URL}/api/orders/${ordersQuery}${currentOnly ? `&delivered=false`: ''}`, tokenConfig(getState))
      dispatch({
        type: GET_MORE_ORDERS,
        payload: orders.data,
      })
    }
  } catch (err) {
    dispatch({ type: ORDERS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}

export const syncOrder = ({ data }) => async (dispatch, getState) => {
  dispatch({
    type: SYNC_ORDER,
    payload: data
  })
}