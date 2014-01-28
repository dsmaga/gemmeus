var mongoose = require('../datasources/mongoose')
  , Schema = mongoose.Schema
  , HighScoreSchema

HighScoreSchema = new Schema(
  { name: String
  , score: Number
  , date: Date
  }
)

module.exports = mongoose.model('HighScore', HighScoreSchema)
