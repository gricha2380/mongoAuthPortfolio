let loggedOut = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect('/')
    }
    return next();
}

let requiresLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        let err = new Error('You must login to view this page...');
        err.status = 401;
        // return next(err); // return error
        return res.redirect('/login')
    }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;