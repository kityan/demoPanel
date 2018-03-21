const
  express = require('express'),
  router = express.Router()
  ;

module.exports = (system) => {

  router.post('/', (req, res) => {

    if (!system.requestValidator.validate('userLogin', req, res)) { return; }

    system.storageManager.userSignup(req.body.name, req.body.password)
      .then(id => res.status(200).json({ id }))
      .catch(error => res.status(500).json({ error }));

  });

  return router;
};
