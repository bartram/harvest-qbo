import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';

import { setOAuthConsumer, setRequestToken } from '../actions'

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import qs from 'qs';

class Settings extends Component {

  connect(event) {

    let dispatch = this.props.dispatch;

    event.preventDefault();

    // @todo validate these values...
    let values = {
      key: this.refs.consumerKey.getValue(),
      secret: this.refs.consumerSecret.getValue(),
    }

    let oauth = new OAuth({
      consumer: values,
      signature_method: 'HMAC-SHA1',
      hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      }
    });

    var request = {
      url: 'https://oauth.intuit.com/oauth/v1/get_request_token',
      method: 'GET',
      data: {
        oauth_callback: window.chrome.extension.getURL('index.html'),
      },
    };

    fetch(request.url, {
        headers: oauth.toHeader(oauth.authorize(request))
      })
      .then(function(response) {

        if (response.ok) {

          // call action...
          dispatch(setOAuthConsumer(values));

          response.text().then(function (text) {

            var requestToken = qs.parse(text);

            // @todo wait until this is done?
            dispatch(setRequestToken(requestToken));

            window.intuit.ipp.anywhere.setup({
              grantUrl: 'https://appcenter.intuit.com/Connect/Begin?oauth_token=' + requestToken.oauth_token,
              datasources: {
                quickbooks : true,
              }
            });
            window.intuit.ipp.anywhere.controller.onConnectToIntuitClicked();

          });
        }
        else {
          console.log(response.statusText);
        }
      })

    return false;

  }
  render() {

    if (this.props.company.CompanyInfo) {
      var company = (<div>{this.props.company.CompanyInfo.CompanyName}</div>)
    }

    if (this.props.company.CompanyName) {

      // Disconnect
      return (<div>{this.props.company.CompanyName}</div>);

    }
    else {

      return (
        <div className="App">
          <form onSubmit={this.connect.bind(this)}>
            <div>
              <TextField hintText="Consumer Key" name="consumerKey" ref="consumerKey" defaultValue={this.props.oauth.key} />
            </div>
            <div>
              <TextField hintText="Consumer Secret" name="consumerSecret" ref="consumerSecret" defaultValue={this.props.oauth.secret} />
            </div>
            <button>Connect To QuickBooks</button>
          </form>

        </div>
      );

    }

  }
}

Settings.defaultProps = {
  oauth: {
    key: '',
    secret: '',
  }
}

const mapStateToProps = function(state) {
  return state;
}

export default connect(mapStateToProps)(Settings);
