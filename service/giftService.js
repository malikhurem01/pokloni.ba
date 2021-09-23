const fs = require('fs');
const path = require('path');
const Gift = require('../models/gift');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

exports.getGifts = () => {
  return Gift.fetchAll();
};

exports.addGift = (title, description, userId, image) => {
  if (!image) {
    gift = new Gift(title, null, description, userId);
  } else {
    gift = new Gift(title, image.path, description, userId);
  }
  return gift.save();
};

exports.postEditGift = (req, giftId, title, description, imageUrl) => {
  let gift;
  if (!imageUrl) {
    gift = new Gift(title, null, description, req.session.user._id, giftId);
  } else {
    gift = new Gift(
      title,
      imageUrl.path,
      description,
      req.session.user._id,
      giftId
    );
  }
  Gift.findById(giftId).then(fetchedGift => {
    if (
      fetchedGift.userId.toString() == req.session.user._id.toString() ||
      req.session.user.isAdmin
    ) {
      return gift.update();
    } else {
      throw 'Not authorized!';
    }
  });
};

exports.postDeleteGift = async giftId => {
  let gift = await Gift.findById(giftId);
  if (gift.imageUrl) {
    fs.unlink(
      path.join(__dirname, '../', 'images', gift.imageUrl.split('\\')[1]),
      err => {
        console.log(err);
      }
    );
  }
};

exports.getMyGifts = async user_id => {
  let db = getDb();
  return await db
    .collection('pokloni')
    .find({ userId: new mongodb.ObjectId(user_id) })
    .toArray();
};
