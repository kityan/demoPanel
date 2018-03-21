const config = require('./config');
const dbErrs = config.messages.errors.storage;

module.exports = {

  methodNotAllowed(router) {
    router.stack.forEach(el => {
      if (el.route) { router.all(el.route.path, (req, res) => res.sendStatus(405)); }
    });
  },

  responseWithError(error, res) {
    switch (error) {
      case (dbErrs.TASK_NOT_FOUND): res.status(404); break;
      case (dbErrs.ACCESS_DENIED): res.status(403); break;
      case (dbErrs.DB_ERROR):
      case (dbErrs.USER_ALREADY_EXISTS):
      case (dbErrs.USER_NOT_FOUND):
      case (dbErrs.WRONG_PASSWORD): res.status(500); break;

    }
    res.json({ error });
  },

  checkAuthentication(req, res, next) {
    if (req.userId !== undefined) { next(); } else { res.sendStatus(401); }
  },

};
