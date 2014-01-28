module.exports =
  { options:
      { esnext: true
      , camelcase: true
      , eqeqeq: true
      , indent: 2
      , latedef: true
      , newcap: true
      , noarg: true
      , noempty: true
      , nonew: true
      , quotmark: 'single'
      , undef: true
      , unused: true
      , trailing: true
      , maxlen: 80
      , asi: true
      , node: true
      , laxcomma: true
      , noyield: true
      }
  , app: [ 'Gruntfile.js', 'app/**/*.js' ]
  , tasks: [ 'tasks/**/*.js' ]
  , assets:
      { options:  { browser:  true
                  , globals:  { '$': true
                              , '_': true
                              , 'ko': true
                              , 'bootbox': true
                              }
                  , exported: [ 'Game' ]
                  }
      , files: { src: [ 'assets/**/*.js' ] }
      }
  }
