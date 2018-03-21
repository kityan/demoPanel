const
  express = require('express'),
  bodyParser = require('body-parser'),
  EventEmitter = require('events').EventEmitter,
  http = require('http'),
  util = require('util'),
  routerUtils = require('./routerUtils'),
  bearerToken = require('express-bearer-token')
  ;

const HttpApiManager = function (system) {
  this.system = system;
  this.app = express();
  this.httpServer = http.createServer(this.app).listen(this.system.config.httpApi.port, () => { console.log('API @ http://localhost:' + this.system.config.httpApi.port); });

  // get token
  this.app.use(bearerToken());

  // verify token if exists
  this.app.use((req, res, next) => {
    if (req.token) {
      this.system.tokenManager.verify(req.token)
        .then(id => {
          req.userId = id;
          next();
        })
        .catch(() => res.status(400).json({ error: this.system.config.messages.errors.parse.INVALID_TOKEN }));
    } else {
      next();
    }
  });

  this.app.use((req, res, next) => {
    bodyParser.json()(req, res, (error) => {
      if (error) {
        res.status(400).json({ error: this.system.config.messages.errors.parse.INVALID_JSON });
        return;
      }
      next();
    });
  });

  this.app.use(bodyParser.urlencoded({ extended: true }));

  const routes = require('./../routes/')(this.system);
  [
    ['/', routes.home],
    ['/tasks', routes.tasks],
    ['/users', routes.users],
    ['/tokens', routes.tokens],
    ['/task', routes.task],
  ].forEach(el => {
    routerUtils.methodNotAllowed(el[1]);
    this.app.use(el[0], el[1]);
  });

  this.app.use('*', (req, res) => res.sendStatus(400));

};

util.inherits(HttpApiManager, EventEmitter);

module.exports = HttpApiManager;
