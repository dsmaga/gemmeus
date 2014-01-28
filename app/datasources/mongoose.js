var mongoose = require('mongoose')
  , mongoConfig = require('../config/mongo')

// connect to mongo
mongoose.connect(mongoConfig.uri, mongoConfig.options, function(err) {
  if(err) throw err
})

mongoose.connection.on('error', function(err) {
  console.error(err)
})

module.exports = mongoose
