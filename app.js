process.chdir(__dirname);
process.on('SIGINT', () => { process.exit(0); }); // not gracefully, just for test task
module.exports = new (require('./modules/Core.js'));
