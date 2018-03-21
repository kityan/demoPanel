const
  express = require('express'),
  router = express.Router()
  ;

module.exports = (system) => {

  router.post('/', (req, res) => {
    if (!system.requestValidator.validate('userLogin', req, res)) { return; }

    system.storageManager.userLogin(req.body.name, req.body.password)
      .then(id => {
        let token = system.tokenManager.create(id);
        res.status(200).json({ token });
      })
      .catch(error => res.status(500).json({ error }));
  });

  return router;
};
