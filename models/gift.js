const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Gift {
  constructor(title, imageUrl, description, userId, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = new mongodb.ObjectId(userId);
  }
  save() {
    let db = getDb();
    return db
      .collection('pokloni')
      .insertOne(this)
      .then(() => {
        console.log('Gift Added');
      })
      .catch(err => console.log(err));
  }
  update() {
    let db = getDb();
    if (this._id) {
      return db
        .collection('pokloni')
        .updateOne(
          { _id: this._id },
          {
            $set: {
              title: this.title,
              imageUrl: this.imageUrl,
              description: this.description
            }
          }
        )
        .then(() => console.log('Updated'))
        .catch(err => console.log(err));
    } else {
      throw 'No such gift exists!';
    }
  }
  static findById(id) {
    let db = getDb();
    return db
      .collection('pokloni')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then(gift => {
        console.log('Gift fetched');
        return gift;
      })
      .catch(err => console.log(err));
  }
  static fetchAll() {
    let db = getDb();
    return db
      .collection('pokloni')
      .find()
      .toArray()
      .then(gifts => {
        console.log('Gifts fetched');
        return gifts;
      })
      .catch(err => console.log(err));
  }
  static deleteById(id) {
    let db = getDb();
    return db
      .collection('pokloni')
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then(() => console.log('Product deleted'))
      .catch(err => console.log(err));
  }
}

module.exports = Gift;
