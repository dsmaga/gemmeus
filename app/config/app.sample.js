var pkg = require('../../package.json')

module.exports =
  { appName: pkg.name
  , appUser: pkg.name
  , version: pkg.version
  , port: '/tmp/' + pkg.name + '.sock'
  , env: 'development'
  }
