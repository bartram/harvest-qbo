import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import qs from 'qs';

window.chrome.storage.local.get(function (settings) {

  let oauth = new OAuth({
    consumer: settings.oauth,
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  let token = {
    key: settings.accessToken.oauth_token,
    secret: settings.accessToken.oauth_token_secret,
  };

  window.chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      switch (request.type) {
        case 'getCompany':

          var request = {
            url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + settings.realmId + '/companyinfo/' + settings.realmId,
            method: 'GET',
          };

          var headers = oauth.toHeader(oauth.authorize(request, token));
          headers['accept'] = 'application/json';

          // @todo application/json
          fetch(request.url, {
            headers: headers
          }).then(function (response) {
            if (response.ok) {
              response.json().then(function (data) {

                var lastInvoice = data.QueryResponse.Invoice.shift();
                sendResponse({invoiceNumber: lastInvoice.DocNumber});

              });
            }
            else {
              console.log(response);
            }
          });
          return true;

          break;
        case 'getLastInvoiceNumber':

          var request = {
            url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + settings.realmId + '/query?query=SELECT * FROM Invoice ORDERBY DocNumber DESC STARTPOSITION 1 MAXRESULTS 1',
            method: 'GET',
          };

          var headers = oauth.toHeader(oauth.authorize(request, token));
          headers['accept'] = 'application/json';

          // @todo application/json
          fetch(request.url, {
            headers: headers
          }).then(function (response) {
            if (response.ok) {
              response.json().then(function (data) {

                var lastInvoice = data.QueryResponse.Invoice.shift();
                sendResponse({invoiceNumber: lastInvoice.DocNumber});

              });
            }
            else {
              console.log(response);
            }
          });
          return true;

      }
    }
  );

});
