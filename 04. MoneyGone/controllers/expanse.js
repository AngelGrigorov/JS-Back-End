const { expanseModel, userModel } = require('../models/index');
const { handleError } = require('../utils/index');

function getCreate(req, res, next) {
    const user = req.user;

    res.render('expanse/create');
}

function createExpanse(req, res, next) {
    const user = req.user;
    let { name, description, category, total, isReported } = req.body;

    if (isReported === 'on') {
        isReported = true;
    } else {
        isReported = false;
    }

    const newExpanse = {
        name,
        description,
        category,
        total,
        isReported,
        creator: user._id,
        createdAt: Date.now()
    }

    expanseModel.create(newExpanse)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            err.code === 11000 ? handleError(res, 'name', 'Name is already taken!') : handleError(res, err);

            res.render('expanse/create', { user, expanse: newExpanse });
        })
}

// function getDetails(req, res, next) {
//     const user = req.user;
//     const courseId = req.params.id;

//     courseModel.findById(courseId).populate('creator').populate('usersEnrolled')
//         .then(course => {

//             if (course.creator.id === user.id) {
//                 user.isCreator = true;
//             }

//             if(user.enrolledCourses.includes(courseId)) {
//                 user.isEnrolled = true;
//             }

//             res.render('course/details', { user, course })
//         })
//         .catch(err => {
//             next(err);
//         })
// }

// function getEdit(req, res, next) {
//     const user = req.user;
//     const courseId = req.params.id;

//     courseModel.findById(courseId)
//         .then(course => {
//             res.render('course/edit', { user, course })
//         })
//         .catch(err => {
//             next(err);
//         })
// }

// function editCourse(req, res, next) {
//     const user = req.user;
//     const courseId = req.params.id;

//     let { title, description, imageUrl, isPublic } = req.body;

//     if (isPublic === 'on') {
//         isPublic = true;
//     } else {
//         isPublic = false;
//     }

//     const newCourse = {
//         title,
//         description,
//         imageUrl,
//         isPublic,
//     }

//     courseModel.updateOne({ _id: courseId }, newCourse, { runValidators: true })
//         .then(() => {
//             res.redirect(`/course/details/${courseId}`);
//         })
//         .catch(err => {
//             err.code === 11000 ? handleError(res, 'title', 'Title is already taken!') : handleError(res, err);

//             newCourse._id = courseId;
//             res.render('course/edit', { user, course: newCourse });
//         })
// }

function deleteExpanse(req, res, next) {
    const user = req.user;
    const expanseId = req.params.id;

    expanseeModel.deleteOne({_id: expanseId})
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            next(err);
        })
}

// async function enrollCourse(req, res, next) {
//     const user = req.user;
//     const courseId = req.params.id;

//     try {
//         await courseModel.update({ _id: courseId }, { $push: { usersEnrolled: user._id } });
//         await userModel.update({ _id: user._id }, { $push: { enrolledCourses: courseId } });

//         res.redirect(`/course/details/${courseId}`);
//     } catch(e) {
//         next(e);
//     }
// }

module.exports = {
    getCreate,
    createExpanse,
    // getDetails,
    // getEdit,
    // editCourse,
    deleteExpanse
    // enrollCourse
}