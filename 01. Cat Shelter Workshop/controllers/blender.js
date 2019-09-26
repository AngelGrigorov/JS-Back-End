const staticFilesController = require('./static-files-controller');
const homeController = require('./home-controller');
const catController = require('./cat-controller');

module.exports = [
    homeController, 
    catController,
    staticFilesController
]