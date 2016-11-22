import { combineReducers } from 'redux'
import _ from 'lodash'
import update from 'react-addons-update';

function oauth (state = {}, action) {
  switch (action.type) {
    case 'setOAuthConsumer':
      return action.values;
    default:
      return state;
  }
}

function requestToken (state = {}, action) {
  switch (action.type) {
    case 'setRequestToken':
      return _.pick(['oauth_token', 'oauth_token_secret'], action.values);
    default:
      return state;
  }
}

function accessToken (state = {}, action) {
  switch (action.type) {
    case 'setAccessToken':
      return _.pick(['oauth_token', 'oauth_token_secret'], action.values);
    default:
      return state;
  }
}

function company (state = {}, action) {
  console.log(action);
  switch (action.type) {
    case 'setCompany':
      return action.value;
    default:
      return state;
  }
}

const harvestQBO = combineReducers({
  oauth,
  requestToken,
  accessToken,
  company,
})

export default harvestQBO;