const Gift = require('../models/gift');
const fs = require('fs');
//
const giftService = require('../service/giftService');

exports.getGifts = async (req, res, next) => {
  const gifts = await giftService.getGifts();
  res.render('gifts', {
    pageTitle: 'Pokloni.ba | Lista poklona',
    gifts: gifts,
    path: '/gifts',
    user: req.session.user ? req.session.user : { isAdmin: false }
  });
};

exports.getAddGift = (req, res, next) => {
  res.render('edit-gift', {
    pageTitle: 'Pokloni.ba | Dodaj poklon',
    editing: false,
    path: '/add-gift'
  });
};

exports.postAddGift = async (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const userId = req.session.user._id;
  const description = req.body.description.toString().trim();
  await giftService.addGift(title, description, userId, image);
  res.redirect('/gifts/list');
};

exports.getEditGift = (req, res, next) => {
  const editing = req.query.editing;
  if (editing == 'true') {
    Gift.findById(req.params.giftId)
      .then(gift => {
        res.render('edit-gift', {
          pageTitle: 'Pokloni.ba | Uredi poklon',
          gift: gift,
          editing: true,
          path: '/edit-gift'
        });
      })
      .catch(err => console.log(err));
  } else if (editing == 'false') {
    res.redirect('/');
  }
};

exports.postEditGift = async (req, res, next) => {
  const giftId = req.body.giftId;
  const title = req.body.title;
  const imageUrl = req.file;
  const description = req.body.description.toString().trim();
  try {
    await giftService.postEditGift(req, giftId, title, description, imageUrl);
    res.redirect('/gifts/my-gifts');
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteGift = async (req, res, next) => {
  const giftId = req.body.giftId;
  let gift = await Gift.findById(giftId);
  if (
    gift.userId.toString() === req.session.user._id.toString() ||
    req.session.user.isAdmin
  ) {
    try{
      await giftService.postDeleteGift(giftId);
    }catch(err){
      console.log(err);
    }
    await Gift.deleteById(gift._id);
  } else {
    return res.send("This is not your gift nor you're an admin");
  }
  res.redirect('/gifts/list');
};

exports.getMyGifts = async (req, res, next) => {
  let myGifts = await giftService.getMyGifts(req.session.user._id);
  res.render('my-gifts', {
    pageTitle: 'Pokloni.ba | Moji pokloni',
    gifts: myGifts,
    path: '/my-gifts'
  });
};

exports.getOrderGift = async (req, res, next) => {
  if (!req.session.user) {
    let htmlCode =
      '<html><head><title>Narudžba nije uspjela</title></head><body><h1 style="font-family: Arial;">Morate biti prijavljeni korisnik da biste naručili poklon.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a></h1>';
    return res.send(htmlCode);
  }
  let db = getDb();
  let order = {
    giftId: new mongodb.ObjectId(req.params.giftId),
    userId: req.session.user._id
  };
  await db.collection('orders').insertOne(order);
  let htmlCode =
    '<html><head><title>Narudžba je uspjela</title></head><body><h1 style="font-family: Arial;">Uspješno ste poslali narudžbu.<br> Molimo vas kliknite na ovaj <a href="/">Link</a> da se vratite na početnu stranicu</h1>';
  res.send(htmlCode);
};
