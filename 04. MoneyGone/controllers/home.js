const { expanseModel } = require('../models/index');


async function getHome(req, res, next) {
    const user = req.user;
    let expanses = [];

    expanses = await expanseModel.find();
        res.render('index', { user, expanses });
}

module.exports = {
    getHome
};