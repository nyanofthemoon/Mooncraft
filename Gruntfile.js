module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch:babel_server', 'watch:babel_client', 'watch:sass']
            }
        },

        watch: {
            babel_server: {
                files: ['server/**/*.es6'],
                tasks: ['clean:server', 'babel:server', 'shell:server'],
                options: {
                    atBegin: true
                }
            },
            babel_client: {
                files: ['client/**/*.es6'],
                tasks: ['clean:client', 'babel:client', 'shell:client'],
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
            server: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        src: ['server/**/*.es6'],
                        ext: '.js'
                    }
                ]
            },
            client: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        src: ['client/**/*.es6'],
                        ext: '.js'
                    }
                ]
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
            server: ['server/**/*.js', 'server/**/*.map'],
            client: ['client/**/*.js', 'client/**/*.map']
        },

        shell: {
            server: {
                command: 'node server/main.js'
            },
            client: {
                command: 'node client/main.js'
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
    grunt.registerTask('build', ['babel:server', 'babel:client']);

}