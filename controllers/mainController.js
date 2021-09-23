exports.landingPage = (req, res, next) => {
  res.render('index', {
    pageTitle: 'Pokloni.ba | Dobrodošli na pokloni.ba',
    path: '/'
  });
};
