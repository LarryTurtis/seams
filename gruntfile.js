module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        replace: {
            example: {
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
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'replace']);

};
