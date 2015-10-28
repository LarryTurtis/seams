module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        replace: {
            html: {
                src: 'app/index.html', // source files array (supports minimatch)
                dest: 'dist/index.html', // destination directory or file
                replacements: [{
                    from: '  src="', // string replacement
                    to: ' src="./seams/'
                },
                {
                    from: '  href="', // string replacement
                    to: ' href="./seams/'
                }]
            },
            js: {
                src: 'app/app.js', // source files array (supports minimatch)
                dest: 'dist/app.js', // destination directory or file
                replacements: [{
                    from: 'templateUrl: "', // string replacement
                    to: 'templateUrl: "dist/'
                }]
            }
        },
        ngtemplates: {
            seams: {
                src: 'dist/**/**.html',
                dest: 'dist/app.js',
                options: {
                    append: true
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: "app/",
                    src: '**/*',
                    dest: 'dist/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'replace', 'ngtemplates']);

};
