import React from 'react';
import { render } from 'react-dom';
import { MuiThemeProvider } from 'material-ui';

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import { Provider } from 'react-redux'
import App from './components/App';

import harvestQBO from './reducers'

import { setAccessToken, setRealmId, setCompany } from './actions';

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import qs from 'qs';

// Get the consumer key and secret...
window.chrome.storage.sync.get(function (settings) {

  const loggerMiddleware = createLogger()
  let store = createStore(harvestQBO, settings, applyMiddleware(thunkMiddleware, loggerMiddleware))
  let state = store.getState();

  // If this is a callback...
  if (window.location.search) {

    var params = qs.parse(window.location.search.substring(1));
    store.dispatch(setRealmId(params.realmId));

    let oauth = new OAuth({
      consumer: state.oauth,
      signature_method: 'HMAC-SHA1',
      hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      }
    });

    var requestToken = state.requestToken;
    var request = {
      url: 'https://oauth.intuit.com/oauth/v1/get_access_token',
      method: 'GET',
      data: {
        oauth_token: requestToken.oauth_token,
        oauth_verifier: params.oauth_verifier,
      }
    };

    var token = {
      secret: requestToken.oauth_token_secret,
    }

    fetch(request.url, {
        headers: oauth.toHeader(oauth.authorize(request, token))
      })
      .then(function(response) {
        if (response.ok) {
          response.text().then(function (text) {

            var accessToken = qs.parse(text);
            store.dispatch(setAccessToken(accessToken)).then(function() {
              window.close();
            });

          });
        }
        else {
          console.log(response);
        }
      });

  }
  // Else show options page
  else {

    // If accessToken, try to get company

    if (settings.accessToken && settings.realmId) {

      var request = {
        url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + settings.realmId + '/companyinfo/' + settings.realmId,
//         url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + settings.realmId + '/query?query=SELECT * FROM Invoice ORDERBY DocNumber DESC STARTPOSITION 1 MAXRESULTS 1',
        method: 'GET',
      };

      var token = {
        key: settings.accessToken.oauth_token,
        secret: settings.accessToken.oauth_token_secret,
      };

      let oauth = new OAuth({
        consumer: state.oauth,
        signature_method: 'HMAC-SHA1',
        hash_function: function(base_string, key) {
          return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
      });

      var headers = oauth.toHeader(oauth.authorize(request, token));
      headers['accept'] = 'application/json';

      // @todo application/json
      fetch(request.url, {
        headers: headers
      }).then(function (response) {
        if (response.ok) {
          response.json().then(function (obj) {
            console.log(obj);
//            store.dispatch(setCompany(obj.CompanyInfo));
          });
        }
        else {
          console.log(response);
        }
      });

    }

    render(
      <Provider store={store}>
        <MuiThemeProvider>
          <App />
        </MuiThemeProvider>
      </Provider>,
      document.getElementById('root')
    );

  /*
    window.chrome.storage.local.get(['accessToken', 'realmId'], function (settings) {

      // Operation: GET /v3/company/<companyId>/companyinfo/<companyId>
      // https://sandbox-quickbooks.api.intuit.com/v3/company/account/1

      if (settings.accessToken && settings.realmId) {

        var request = {
          url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + settings.realmId + '/companyinfo/' + settings.realmId,
          method: 'GET',
        };

        var token = {
          key: settings.accessToken.oauth_token,
          secret: settings.accessToken.oauth_token_secret,
        };
        console.log(token);

        console.log(oauth.authorize(request, token));

        var headers = oauth.toHeader(oauth.authorize(request, token));
        headers['accept'] = 'application/json';
        console.log(headers);

        // @todo application/json
        fetch(request.url, {
          headers: headers
        }).then(function (response) {
          return response.text();
        }).then(function (response) {
          console.log(response);
        });

      }

      ReactDOM.render(
        <Options {...settings } />,
        document.getElementById('root')
      );

    });
  */

  }

});

