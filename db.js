const MongoClient = require('mongodb').MongoClient

const state = {
  db: null
}

exports.connect = (url, done) => {
  if (state.db) {
    return done()
  }

  MongoClient.connect(url, (err, db) => {
    if (err) {
      return done(err)
    }
    state.db = db
  })
}

exports.get = () => {
  return state.db
}
