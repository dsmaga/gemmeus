module.exports = function(grunt) {
  grunt.initConfig(
    { jshint: require('./tasks/jshint')
    , clean: require('./tasks/clean')
    , less: require('./tasks/less')
    , concat: require('./tasks/concat')
    , uglify: require('./tasks/uglify')
    , watch: require('./tasks/watch')
    }
  )

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('deployAssets',
    [ 'clean:pre'
    , 'jshint'
    , 'less'
    , 'concat'
    , 'clean:post'
    ]
  )

  grunt.registerTask('deployProductionAssets',
    [ 'deployAssets'
    , 'uglify'
    ]
  )

  grunt.registerTask('default', ['deployAssets', 'watch'])
}
