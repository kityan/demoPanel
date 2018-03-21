const config = require('./../modules/config');
const chai = require('chai');
chai.use(require('chai-http'));
global.request = chai.request;
global.expect = chai.expect;
global.url = 'http://localhost:' + config.httpApi.port;
global.data = {
  user1: {
    name: 'test' + Date.now(),
    id: null,
    password: '123',
    token: null,
    nameNotExists: 'testNotExists' + Date.now(),
    passwordWrong: Math.random() + '',
    title1: 'title' + Date.now(),
    body1: 'body' + Date.now(),
    title2: 'title' + Date.now(),
    body2: 'body' + Date.now(),
    task1id: null,
    task2id: null,
  },
  user2: {
    name: 'test2' + Date.now(),
    id: null,
    password: '123',
    token: null,
  }
};
