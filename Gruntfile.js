module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch:sass', 'shell:client', 'shell:server', 'shell:workers']
            }
        },

        watch: {
            sass: {
                files: 'client/src/scss/**/*.scss',
                tasks: ['sass:dev'],
                options: {
                    atBegin: true
                }
            }
        },

        sass: {
            dev: {
                options: {
                    style: 'nested',
                    quiet: true,
                    lineNumbers: true
                },
                files: [{
                    expand: true,
                    cwd: 'client/src/scss',
                    src: ['*.scss'],
                    dest: 'client/public/assets/css',
                    ext: '.css'
                }]
            }
        },

        clean: {
        },

        shell: {
            client: {
                command: 'node_modules/.bin/webpack-dev-server'
            },
            server: {
                command: 'node_modules/.bin/nodemon --watch server server/main.js'
            },
            workers: {
                command: 'node_modules/.bin/nodemon --watch server server/workers/main.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('build', ['shell:webpack']);

}