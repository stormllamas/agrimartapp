import { SITE_LOADING, SITE_LOADED, HIDE_SITE_MESSAGE, SET_SIDEBAR_TOGGLER } from './types'
import axios from 'axios';

// export const PROJECT_URL = 'https://quezonagrimart.com.ph'
export const PROJECT_URL = 'http://192.168.1.9:8000'
// export const PROJECT_URL = 'http://192.168.43.236:8000'
export const GOOGLE_API_KEY = 'AIzaSyBi8DvnA6CTed6XFHBnbXggQG1Ry7YhktA'
export const DEBUG = true


export const loadSite = () => async dispatch => {
  dispatch({ type: SITE_LOADING });
  const res = await axios.get(`${PROJECT_URL}/api/get_site_info`)
  dispatch({
    type: SITE_LOADED,
    payload: res.data
  });
}

export const hideSiteMessage = () =>{
  return {
    type: HIDE_SITE_MESSAGE,
  };
}

export const setMenuToggler = sideBarToggler => async dispatch => {
  dispatch({
    type: SET_SIDEBAR_TOGGLER,
    payload: sideBarToggler
  });
}
