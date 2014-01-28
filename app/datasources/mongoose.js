var mongoose = require('mongoose')

// connect to mongo
mongoConfig = require('../config/mongo')
mongoose.connect(mongoConfig.uri, mongoConfig.options, function(err) {
  if(err) throw err
})

mongoose.connection.on('error', function(err) {
  console.error(err)
})

module.exports = mongoose
