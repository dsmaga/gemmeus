module.exports =
  { lintScripts:
      { files: ['**/*.js']
      , tasks: ['jshint']
      }
  , concatScripts:
      { files: ['assets/**/*.js']
      , tasks: ['concat:appJs']
      }
  , styles:
      { files: ['assets/styles/**/*.less']
      , tasks: ['less', 'clean:post']
      }
  , templates:
      { files: ['app/views/**']
      , options: { livereload: true }
      }
  , livereload:
      { files: ['public/**/*']
      , options: { livereload: true }
      }
  , gruntfile:
      { files: ['Gruntfile.coffee', 'tasks/**/*.js']
      , tasks: ['deployAssets']
      }
  }
