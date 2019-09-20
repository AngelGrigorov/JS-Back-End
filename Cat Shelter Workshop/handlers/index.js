const homeHandler = require('./home');
const staticFiles = require('./static-files');
const carHandler = require('./cat');
module.exports = [homeHandler, staticFiles, carHandler];