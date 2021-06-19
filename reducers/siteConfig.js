import { SITE_LOADING, SITE_LOADED, HIDE_SITE_MESSAGE, SET_SIDEBAR_TOGGLER } from '../actions/types'

const initialState = {
  siteInfo: null,
  siteInfoLoading: true,
  showSiteMessage: true,

  sideBarToggled: null,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SITE_LOADING:
      return {
        ...state,
        siteInfoLoading: true,
      }

    case SITE_LOADED:
      return {
        ...state,
        siteInfoLoading: false,
        siteInfo: action.payload
      }

    case HIDE_SITE_MESSAGE:
      return {
        ...state,
        showSiteMessage: false,
      }

    case SET_SIDEBAR_TOGGLER:
      return {
        ...state,
        sideBarToggled: action.payload
      }
    
    default:
      return state
  }
}