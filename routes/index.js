const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mid = require('../middleware');

// logout
router.get('/logout', (req,res, next)=> {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err)
      } else {
        User.info = null;
        return res.redirect('/')
      }
    })
  }
})

// login page
router.get('/login', mid.loggedOut, (req, res, next) => {
  return res.render('login', {title: 'Log In'})
})

router.post('/login', (req, res, next)=> {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        let err = new Error('Wrong username or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id; // set session
        console.log('login info correct, redirecting to overview');
        // return res.redirect('/overview')

        // loadMenuInfo(user._id) // todo
        
        // from profile page
        User.findById(user._id)
          .exec((error, user)=>{
            if (error) {
              return next(error);
            } else {
              User.info = {name:user.name}
              return res.redirect('/overview')
              // return res.render('overview', {title: 'Overview', name: user.name, favorite: user.favoriteBook})
            }
          })
          // end profile
      }
    });
  } else {
    let err = new Error('You need email and password')
    err.status = 401;
    return next(err);
  }
})

// registration page
router.get('/register', mid.loggedOut, (req, res, next) => {
  return res.render('register', { title:'Sign Up!'});
});

router.post('/register', (req, res, next) => {
  if (req.body.email && req.body.name && req.body.password && req.body.confirmPassword && req.body.favoriteBook) {
    // confirm passwords match
    let userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    }

    User.create(userData, (error, user) => {
      if (error) {
        return next(error)
      } else {
        req.session.userId = user._id;
        return res.redirect('/overview')
      }
    })

    if (req.body.password !== req.body.confirmPassword) {
      let err = new Error('Passwords do not match')
      err.status=400;
      return next(err)  
    }
    return 
  } else {
    let err = new Error('All fields are required')
    err.status=400;
    return next(err)
  }
});

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {
  //  replaced with mid.requiresLogin
  //   if (!req.session.userId) {
  //   let err = new Error("You are not authorized to view this page")
  //   err.status = 403;
  //   return next(err);
  // }
  User.findById(req.session.userId)
    .exec((error, user)=>{
      if (error) {
        return next(error);
      } else {
        return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook})
      }
    })
});

// GET /overview
router.get('/overview', mid.requiresLogin, (req, res, next) => {
  console.log('inside overview');
  return res.render('overview', { title: 'Overview', user:User.info, partials : { menuPartial : './partials/nav'} });
});


// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' , user:User.info, partials : { menuPartial : './partials/nav'} });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});

// GET /
router.get('/', (req, res, next) => {
  // return res.render('overview', { title: 'Overview' });
  return res.redirect('/overview')
});


module.exports = router;
