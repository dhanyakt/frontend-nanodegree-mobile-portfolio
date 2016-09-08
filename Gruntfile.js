'use-strict';

var ngrok = require('ngrok');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

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
                width:650,
                quality:60
              },
              {
                name:"large",
                width:800,
                quality:30,
                suffix:"1x"
              },
              {
                name:"large",
                width:1024,
                suffix:"2x",
                quality:30

              }]
            },

            files: [{
              expand: true,
              src: ['*.{gif,webp}'],
              cwd: 'views/images/',
              dest: 'views/images/images_src'
            }]
          }
        },

        clean: {
            folder: ['views/images/images_src']
        },

        mkdir: {
            dev: {
                options: {
                    create: ['views/images/images_src']
                },
            },
        },

        inline: {
            build: {
                options: {
                    cssmin: true,
                    uglify: true
                },
                src: 'index.html',
                dest: 'build/'
            }
        },

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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-inline');

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

    grunt.registerTask('default',['clean','mkdir','responsive_images','inline','psi-ngrok']);
};