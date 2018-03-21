const jwt = require('jsonwebtoken');

const TokenManager = function (system) {
  this.system = system;
};

TokenManager.prototype.create = function (id) {
  return jwt.sign({ id }, this.system.config.tokenSecret);
};

TokenManager.prototype.verify = function (token) {
  return new Promise((resolve) => {
    let decoded = jwt.verify(token, this.system.config.tokenSecret);
    resolve(decoded.id);
  });
};


module.exports = TokenManager;
