const adminService = require('../service/adminService');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Pokloni.ba | Uloguj se',
    error: false
  });
};
exports.postLogin = async (req, res, next) => {
  if (!req.body.password) {
    res.render('login', {
      pageTitle: 'Pokloni.ba | Uloguj se',
      error: true
    });
  }
  try {
    const user = await adminService.getUserByEmail(req.body.email);
    if (!user) {
      return res.render('login', {
        pageTitle: 'Pokloni.ba | Uloguj se',
        error: true
      });
    }
    const doMatch = await adminService.passwordsDoMatch(
      req.body.password,
      user.password
    );
    if (doMatch) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      return req.session.save(err => {
        if (!err) {
          res.redirect('/');
        }
        console.log(err);
        return res.render('login', {
          pageTitle: 'Pokloni.ba | Uloguj se',
          error: true
        });
      });
    } else {
      return res.render('login', {
        pageTitle: 'Pokloni.ba | Uloguj se',
        error: true
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('<h1>Nema sesije</h1>');
  }
};

exports.getSignup = (req, res, next) => {
  res.render('signup', {
    pageTitle: 'Pokloni.ba | Registruj se',
    error: false
  });
};

exports.postSignup = async (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await adminService.getUserByEmail(req.body.email);
    if (user) {
      return res.render('signup', {
        pageTitle: 'Pokloni.ba | Registruj se',
        error: true
      });
    }
  } catch (err) {
    console.log(err);
  }
  try {
    await adminService.createUser(name, lastName, email, password);
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

exports.getMyProfile = (req, res, next) => {
  res.render('profil', {
    pageTitle: 'Pokloni.ba | Moj profil',
    image: null
  });
};

exports.postDeleteProfile = async (req, res, next) => {
  const id = req.body.id;
  if (id == req.session.user._id) {
    try {
      await adminService.deleteUserById(id);
      const err = await req.session.destroy();
      if (err) {
        res.send('<h1>Nema sesije</h1>');
      } else {
        res.redirect('/');
      }
    } catch (err) {
      console.log(err);
    }
  }
};
