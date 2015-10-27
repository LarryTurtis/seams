module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        processhtml: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'dist/index.html': ['app/index.html']
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**'],
                    dest: 'dist/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'processhtml']);

};
