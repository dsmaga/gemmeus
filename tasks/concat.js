module.exports =
  { appCss:
      { options: { separator: '\n' }
      , src: ['tmp/css/app.css']
      , dest: 'public/css/app.css'
      }
  , appJs:
      { src:
        [ 'bower_components/jquery/jquery.js'
        , 'bower_components/knockout.js/knockout.js'
        , 'bower_components/lodash/dist/lodash.js'
        , 'bower_components/bootstrap/dist/js/bootstrap.js'
        , 'assets/scripts/game.js'
        ]
      , dest: 'public/js/app.js'
      }
  }
