const
  express = require('express'),
  router = express.Router(),
  routerUtils = require('./../modules/routerUtils')
  ;

module.exports = (system) => {

  router.use(routerUtils.checkAuthentication);

  router.post('/', (req, res) => {
    if (!system.requestValidator.validate('taskCreate', req, res)) {
      return;
    }
    system.storageManager.taskCreate(req.body, req.userId)
      .then(id => res.status(200).json({ id }))
      .catch(error => routerUtils.responseWithError(error, res));
  });

  router.get('/', (req, res) => {
    system.storageManager.tasksGet(req.userId)
      .then(tasks => res.status(200).json({ tasks }))
      .catch(error => routerUtils.responseWithError(error, res));
  });

  return router;
};
