module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch:sass', 'watch:babel_client', 'shell:client', 'shell:server', 'shell:workers']
            }
        },

        watch: {
            babel_client: {
                files: ['client/public/assets/js/**/*.es6'],
                tasks: ['babel:client'],
                options: {
                    atBegin: true
                }
            },
            sass: {
                files: 'client/public/assets/scss/**/*.scss',
                tasks: ['sass:dev'],
                options: {
                    atBegin: true
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            client: {
                files: [{
                    expand: true,
                    cwd: 'client/public/assets/js',
                    src: ['**/*.es6'],
                    dest: 'client/public/assets/js',
                    ext: '.transpiled.js'
                }]
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
                    cwd: 'client/public/assets/scss',
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
                command: 'node_modules/.bin/nodemon --watch client --ignore client/public client/main.js'
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
    grunt.registerTask('build', ['babel:client']);

}