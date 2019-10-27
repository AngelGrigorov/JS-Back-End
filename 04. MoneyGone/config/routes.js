const { homeController, userController, expanseController } = require('../controllers/index');
const { auth } = require('../utils/index');


module.exports = (app) => {
    // Users
    app.get('/register', userController.getRegister);
    app.post('/register', userController.register);
    app.get('/login', userController.getLogin);
    app.post('/login', userController.login);
    app.get('/logout', auth(), userController.logout);

    // Expanses
    app.get('/expanse/create', auth(), expanseController.getCreate);
    app.post('/expanse/create', auth(), expanseController.createExpanse);
    // app.get('/expanse/details/:id', auth(), expanseController.getDetails);
    // app.get('/expanse/edit/:id', auth(), expanseController.getEdit);
    // app.post('/expanse/edit/:id', auth(), expanseController.editCourse);
    app.get('/expanse/delete/:id', auth(), expanseController.deleteExpanse);
    // app.get('/expanse/enroll/:id', auth(), expanseController.enrollCourse)

    app.get('/', auth(false), homeController.getHome);

    app.all('*', auth(false), (req, res) => res.render('errors/404', { user: req.user }));
};