module.exports =
  { app:
      { options:
          { paths:  [ 'bower_components/bootstrap/less'
                    , 'bower_components/font-awesome/less'
                    ]
          , compress: true
          }
      , files: {'tmp/css/app.css': 'assets/styles/app.less'}
      }
  }
