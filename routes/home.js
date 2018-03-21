const
  express = require('express'),
  router = express.Router();

module.exports = () => {

  router.get('/', function (req, res) {
    res.send('demo-panel');
  });

  return router;
};
