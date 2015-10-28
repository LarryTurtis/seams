module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        replace: {
            html: {
                src: 'dist/**/*.html', // source files array (supports minimatch)
                overwrite: true, // destination directory or file
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
                src: 'dist/**/*.js', // source files array (supports minimatch)
                overwrite: true,
                replacements: [{
                    from: 'templateUrl: "', // string replacement
                    to: 'templateUrl: "dist/'
                },{
                    from: '/api/', // string replacement
                    to: '/seams/api/'
                }]
            },
            jade: {
                src: 'dist/**/*.jade', // source files array (supports minimatch)
                overwrite: true,
                replacements: [{
                    from: 'action="/', // string replacement
                    to: 'action="/seams/'
                },{
                    from: 'href="/', // string replacement
                    to: 'href="/seams/'
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
