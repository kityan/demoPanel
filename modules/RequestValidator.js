const RequestValidator = function (system) {
  this.ve = system.config.messages.errors.validate;
  this.requestValidators = {

    taskCreate: ['knownTaskKeys', 'title', 'body', 'allowedUserIds'],
    taskGet: ['taskId'],
    taskUpdate: ['taskId', 'knownTaskKeys', 'allowedUserIds'],
    userLogin: ['knownUserKeys', 'name', 'password'],

    _steps: {
      taskId(req) {
        if (!req.params.id || parseInt(req.params.id) != req.params.id || req.params.id <= 0) {
          req.validatorsErrors.push(this.ve.INVALID_TASK_ID);
        }
      },
      knownTaskKeys(req) {
        let knownKeys = { title: true, body: true, allowedUserIds: true };
        for (let k in req.body) { if (!knownKeys[k]) { req.validatorsErrors.push(this.ve.UNKNOWN_KEY + ': ' + k); } }
      },
      knownUserKeys(req) {
        let knownKeys = { name: true, password: true };
        for (let k in req.body) { if (!knownKeys[k]) { req.validatorsErrors.push(this.ve.UNKNOWN_KEY + ': ' + k); } }
      },
      name(req) {
        if (!req.body.name) { req.validatorsErrors.push(this.ve.EMPTY_USER_NAME); }
      },
      password(req) {
        if (!req.body.password) { req.validatorsErrors.push(this.ve.EMPTY_USER_PASSWORD); }
      },
      title(req) {
        if (!req.body.title) { req.validatorsErrors.push(this.ve.EMPTY_TASK_TITLE); }
      },
      body(req) {
        if (!req.body.body) { req.validatorsErrors.push(this.ve.EMPTY_TASK_BODY); }
      },
      allowedUserIds(req) {
        if (req.body.allowedUserIds) {
          if (
            !Array.isArray(req.body.allowedUserIds) ||
            req.body.allowedUserIds.some(el => parseInt(el) != el)
          ) {
            req.validatorsErrors.push(this.ve.INVALID_ALLOWED_USER_IDS_LIST);
          }
        }
      },
    }

  };
};

RequestValidator.prototype.validate = function (name, req, res) {
  req.validatorsErrors = req.validatorsErrors || [];
  this.requestValidators[name].forEach(name => this.requestValidators._steps[name].call(this, req));
  if (req.validatorsErrors.length) {
    res.status(400).json({ error: req.validatorsErrors.length > 1 ? req.validatorsErrors : req.validatorsErrors[0] });
    return false;
  }
  return true;
};


module.exports = RequestValidator;
