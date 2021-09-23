const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');

const mainRoutes = require('./routes/main');
const giftRoutes = require('./routes/gift');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const mongoConnect = require('./util/database').mongoConnect;
const errorController = require('./controllers/404');
const app = express();

const store = new MongoDBStore({
  uri:
  'mongodb+srv://malik:pokloniba@pokloni.rssgj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  collection: 'sessions'
});

app.use(
  session({
    secret: 'My Secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.set('view engine', 'ejs');
app.set('views', 'views');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.session.user ? req.session.user : false;
  next();
});
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
app.use(authRoutes);
app.use('/gifts', giftRoutes);
app.use('/admin', adminRoutes);
app.use(mainRoutes);
app.use(errorController);
const PORT = process.env.PORT || 3000;
mongoConnect().then(() => {
  app.listen(PORT);
  console.log('Connected');
});
