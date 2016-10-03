'use-strict';

var ngrok = require('ngrok');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

// configuration
    grunt.initConfig({
        responsive_images: {
          dev: {
            options: {
              engine: 'gm',
              sizes: [{
                name:"small",
                width:400,
                quality:60
              },
              {
                name:"medium",
                width:800,
                quality:60
              }]
            },

            files: [{
              expand: true,
              src: ['*.{gif,jpg}'],
              cwd: 'views/images/',
              dest: 'views/images/images_src'
            }]
          }
        },

        clean: {
            folder: ['views/images/images_src']
        },

// Creating new folder
        mkdir: {
            dev: {
                options: {
                    create: ['views/images/images_src','build/views']
                },
            },
        },
// css minification
        cssmin: {
            first_target: {
                files: [{
                    expand: true,
                    cwd: 'views/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'views/css/',
                    ext: '.min.css'
                }]
            },
            second_target: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css/',
                    ext: '.min.css'
                }]
            }
        },

// Inlining css
        inline: {
            build: {
                options: {
                    cssmin: true,
                    uglify: true
                },
                src: ['*.html'],
                dest: 'build/'
            }
        },

// JS minification
        uglify: {
            first_target: {
                files: {
                    'build/views/js/main.min.js':['views/js/main.js']
                }
            },
            second_target: {
                files: {
                    'build/js/perfmatters.min.js': ['js/perfmatters.js']
                }
            },
        },

// HTML minification
        htmlmin: {
            build: {
                options: {
                    removeComments:true,
                    collapseWhitespace:true
                },
                files: {
                    'build/index.html':'build/index.html',
                    'build/project-2048.html': 'build/project-2048.html',
                    'build/project-mobile.html': 'build/project-mobile.html',
                    'build/project-webperf.html': 'build/project-webperf.html',
                    'build/views/pizza.html': 'build/views/pizza.html'
                }
            }
        },

// Plugin to know the pagespeed score in mobile and desktop.
        pagespeed: {
            options: {
                nokey: true,
                locale: "en_GB",
                threshold:30
            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            },
        },
    });

// Grunt tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

// Integration of ngrok with pagespeed.
    grunt.registerTask('psi-ngrok','Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 8000;
        ngrok.connect(port, function(err,url){
            if(err !== null) {
                grunt.fail.fatal(err);
                return done();
            }

            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });

// Grunt tasks
    grunt.registerTask('default',['clean','mkdir','responsive_images','uglify','cssmin','inline','htmlmin','psi-ngrok']);
};