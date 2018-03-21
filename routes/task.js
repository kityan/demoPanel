const
  express = require('express'),
  router = express.Router(),
  routerUtils = require('./../modules/routerUtils')
  ;

module.exports = (system) => {

  router.use(routerUtils.checkAuthentication);

  router.get('/:id', (req, res) => {
    if (!system.requestValidator.validate('taskGet', req, res)) {
      return;
    }
    system.storageManager.taskGet(req.params.id, req.userId)
      .then(task => res.status(200).json({ task }))
      .catch(error => routerUtils.responseWithError(error, res));
  });

  router.put('/:id', (req, res) => {
    if (!system.requestValidator.validate('taskUpdate', req, res)) {
      return;
    }
    system.storageManager.taskUpdate(Object.assign(req.body, { id: req.params.id }), req.userId)
      .then(() => res.sendStatus(200))
      .catch(error => routerUtils.responseWithError(error, res));
  });

  router.delete('/:id', (req, res) => {
    if (!system.requestValidator.validate('taskGet', req, res)) {
      return;
    }
    system.storageManager.taskDelete(req.params.id, req.userId)
      .then(() => res.sendStatus(200))
      .catch(error => routerUtils.responseWithError(error, res));
  });


  return router;
};
