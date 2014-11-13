/*
 * Generated on 2014-11-05
 * generator-assemble v0.5.0
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist'
        },

        sass: {
            dist: {
                options: {
                    sourcemap: true
                },
                files: [{
                    expand: true,
                    cwd   : 'src/sass',
                    src   : '*.scss',
                    dest  : 'dist/css/',
                    ext   : '.css'
                }]
            }
        },
        watch: {
            assemble: {
                files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
                tasks: ['assemble']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.dist %>/{,*/}*.html',
                    '<%= config.dist %>/{,*/}*.css',
                    '<%= config.dist %>/{,*/}*.js',
                    '<%= config.dist %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            sass: {
                files: ['<%= config.src %>/**/*.scss'],
                tasks: ['sass'],
                options : {
                    spawn: false
                }
            },
            js: {
                files: ['<%= config.src %>/**/*.js'],
                tasks: ['concat']
            },
        },
        concat: {
            dist: {
                src: [
                    '<%= config.src %>/js/**/*.js'
                ],
                dest: '<%= config.dist %>/js/all.js',
                separator: ";"
            }
        },
        connect: {
            options: {
                port: 3010,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            }
        },

        assemble: {
            pages: {
                options: {
                    flatten: true,
                    assets: '<%= config.dist %>/assets',
                    layout: '<%= config.src %>/templates/layouts/default.hbs',
                    data: '<%= config.src %>/data/*.{json,yml}',
                    partials: '<%= config.src %>/templates/partials/*.hbs'
                },
                files: {
                    '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
                }
            }
        },

        copy: {
            bootstrap: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/',
                src: '**',
                dest: '<%= config.dist %>/'
            },
            jquery: {
                expand: true,
                cwd: 'bower_components/jquery/dist/',
                src: '**',
                dest: '<%= config.dist %>/js/'
            },
            codemirror_js: {
                expand: true,
                cwd: 'bower_components/codemirror/lib/',
                src: 'codemirror.js',
                dest: '<%= config.dist %>/js/'
            },
            codemirror_css: {
                expand: true,
                cwd: 'bower_components/codemirror/lib/',
                src: 'codemirror.css',
                dest: '<%= config.dist %>/css/'
            },
            assets: {
                expand: true,
                cwd: 'src/assets/',
                src: '**',
                dest: '<%= config.dist %>/'
            }
        },

        aws: grunt.file.readJSON('aws_keys.json'),

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.key %>', // Use the variables
                secretAccessKey: '<%= aws.secret %>', // You can also use env variables
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            ja: {
                options: {
                    bucket: 'ja.monaca.io',
                    region: 'ap-northeast-1',
                },
                files: [
                    {expand: true, cwd: 'dist', src: ['**'], dest: ''},
                ]
            },
        },

        invalidate_cloudfront: {
            options: {
               key: '<%= aws.key %>',
               secret: '<%= aws.secret %>',
               distribution: 'EV2KT3V34BFDP'
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**'],
                    filter: 'isFile',
                    dest: ''
                }]
           }
        },

        // Before generating any new files,
        // remove any previously-created files.
        clean: ['<%= config.dist %>/**/*.{html,xml}']

    });
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');

    grunt.registerTask('server', [
        'build',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'sass',
        'concat',
        'assemble'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'aws_s3',
        'invalidate_cloudfront'
    ]);

};
