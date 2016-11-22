import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

var oauth = new OAuth({
  consumer: {
    key: 'qyprdjwHpGrO6eCujg7QURXogtuKLr',
    secret: 'RII74J9uANrF8basX725BxbwEzIZA3lEg2JN1aFo',
  },
  signature_method: 'HMAC-SHA1',
  hash_function: function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

export default oauth;