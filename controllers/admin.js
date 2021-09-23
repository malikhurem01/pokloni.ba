const getDb = require('../util/database').getDb;
const adminService = require('../service/adminService');
exports.postAddNewAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    const email = req.body.email;
    try {
      const user = await adminService.getUserByEmail();
    } catch (err) {
      console.log('Error while fetching the user\n' + err);
      res.redirect('/404');
    }
    if (!user) {
      console.log('User not found');
      return res.redirect('/');
    }
    user.isAdmin = true;
    try {
      await adminService.updateAdmin(user, true);
    } catch (err) {
      console.log(err);
    }
    console.log('User has been added as admin');
    return res.send('User added as admin');
  }
};
exports.postDeleteAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      const user = await adminService.getUserByEmail();
    } catch (err) {
      console.log('Error while fetching the user\n' + err);
      res.redirect('/404');
    }
    if (!user) {
      res.send('User not found');
      return res.redirect('/');
    }
    if (!user.isAdmin) {
      return res.send('User is not an admin');
    }
    try {
      await adminService.updateAdmin(user, true);
      console.log('User is not admin anymore');
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/404');
  }
};
