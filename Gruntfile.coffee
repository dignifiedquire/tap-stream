module.exports = (grunt) ->
  
  grunt.initConfig
  
  
    browserify:
      "static/bundle.js": 
        requires: []
        aliases: []
        entries: ['index.js']
        prepend: []

    watch:
      files:['index.js']
      tasks:'browserify'
  
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  
  grunt.registerTask 'default', ['browserify', 'watch'] 