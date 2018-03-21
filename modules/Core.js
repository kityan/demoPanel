const Core = function () {
  let system = {};

  system.config = require('./config.js');
  system.tokenManager = new (require('./TokenManager.js'))(system);
  system.requestValidator = new (require('./RequestValidator.js'))(system);
  system.storageManager = new (require('./StorageManager.js'))(system);
  system.httpApiManager = new (require('./HttpApiManager.js'))(system);

  system.storageManager.on('error', function (error) {
    console.log(error);
  });

  this.system = system;

};

module.exports = Core;
