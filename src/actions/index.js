export function setOAuthConsumer(values) {

  return (dispatch) => {
    window.chrome.storage.sync.set({oauth: values}, function () {
      dispatch({ type: 'setOAuthConsumer', values });
    });
  }

}

export function setRequestToken(values) {

  return (dispatch) => {
    window.chrome.storage.sync.set({requestToken: values}, function () {
      dispatch({ type: 'setRequestToken', values });
    });
  }

}

export function setAccessToken(values) {

  return (dispatch) => {

    return new Promise(function (resolve, reject) {

      console.log('set access token', values);

      window.chrome.storage.sync.set({accessToken: values}, function () {
        dispatch({ type: 'setAccessToken', values });
        resolve();
      });

    });

  }

}

export function setRealmId(value) {

  return (dispatch) => {
    window.chrome.storage.sync.set({realmId: value}, function () {
      dispatch({ type: 'setRealmId', value });
    });
  }

}

export function setCompany(value) {
  return { type: 'setCompany', value };
}

/*

export function getOAuthConsumer() {

  return (dispatch) => {
    chrome.storage.sync.get('oauth', function (values) {
      console.log(values);
      dispatch({ type: 'getOAuthConsumer', values.oauth });
    });
  }

}
*/