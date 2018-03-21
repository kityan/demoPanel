module.exports = function (s) {
  return {
    tasks: require('./tasks')(s),
    home: require('./home')(s),
    users: require('./users')(s),
    tokens: require('./tokens')(s),
    task: require('./task')(s),
  };
};
