module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch:babel_client', 'watch:sass', 'watch:server', 'watch:workers']
            }
        },

        watch: {
            babel_client: {
                files: ['client/**/*.es6'],
                tasks: ['babel:client', 'shell:client'],
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
            },
            server: {
                files: ['server/**/*.js', '!server/workers/**/*.js'],
                tasks: ['shell:server'],
                options: {
                    atBegin: true
                }
            },
            workers: {
                files: ['server/workers/**/*.js'],
                tasks: ['shell:workers'],
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
                command: 'node client/main.js'
            },
            server: {
                command: 'node server/main.js'
            },
            workers: {
                command: 'node server/workers/main.js'
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