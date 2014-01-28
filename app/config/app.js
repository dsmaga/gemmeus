var pkg = require('../../package.json')

module.exports =
  { appName: pkg.name
  , appUser: pkg.name
  , version: pkg.version
  , port: 3000
  , env: 'development'
  }
